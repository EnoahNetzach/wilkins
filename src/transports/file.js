/*
 * file.js: Transport for outputting to a local log file
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

import fs from 'fs'
import path from 'path'
import util from 'util'
import async from 'async'
import zlib from 'zlib'
import { isWritable } from 'isstream'
import { Stream } from 'stream'
import os from 'os'
import log from '../common/log'
import tailFile from '../common/tailFile'
import { Transport } from './transport'

//
// ### function File (options)
// #### @options {Object} Options for this instance.
// Constructor function for the File transport object responsible
// for persisting log messages and metadata to one or more files.
//
const File = exports.File = function (options) {
  Transport.call(this, options)

  //
  // Helper function which throws an `Error` in the event
  // that any of the rest of the arguments is present in `options`.
  //
  const throwIf = (target, ...args) => {
    args.forEach((name) => {
      if (options[name]) {
        throw new Error(`Cannot set ${name} and ${target}together`)
      }
    })
  }

  if (options.filename || options.dirname) {
    throwIf('filename or dirname', 'stream')
    this._basename = this.filename = options.filename ? path.basename(options.filename) : 'wilkins.log'

    this.dirname = options.dirname || path.dirname(options.filename)
    this.options = options.options || { flags: 'a' }

    //
    // "24 bytes" is maybe a good value for logging lines.
    //
    this.options.highWaterMark = this.options.highWaterMark || 24
  } else if (options.stream) {
    throwIf('stream', 'filename', 'maxsize')
    this._stream = options.stream
    this._isStreams2 = isWritable(this._stream)
    this._stream.on('error', (error) => {
      this.emit('error', error)
    })
    //
    // We need to listen for drain events when
    // write() returns false. This can make node
    // mad at times.
    //
    this._stream.setMaxListeners(Infinity)
  } else {
    throw new Error('Cannot log to file without filename or stream.')
  }

  this.json = options.json !== false
  this.logstash = options.logstash || false
  this.colorize = options.colorize || false
  this.maxsize = options.maxsize || null
  this.rotationFormat = options.rotationFormat || false
  this.zippedArchive = options.zippedArchive || false
  this.maxFiles = options.maxFiles || null
  this.prettyPrint = options.prettyPrint || false
  this.label = options.label || null
  this.timestamp = options.timestamp != null ? options.timestamp : true
  this.eol = options.eol || os.EOL
  this.tailable = options.tailable || false
  this.depth = options.depth || null
  this.showLevel = options.showLevel === undefined ? true : options.showLevel
  this.maxRetries = options.maxRetries || 2

  if (this.json) {
    this.stringify = options.stringify
  }

  //
  // Internal state variables representing the number
  // of files this instance has created and the current
  // size (in bytes) of the current logfile.
  //
  this._size = 0
  this._created = 0
  this._buffer = []
  this._draining = false
  this._opening = false
  this._failures = 0
  this._archive = null
}

//
// Inherit from `wilkins.Transport`.
//
util.inherits(File, Transport)

//
// Expose the name of this Transport on the prototype
//
File.prototype.name = 'file'

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Wilkins. Metadata is optional.
//
File.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true)
  }

  //
  // If failures exceeds maxRetries then we can't access the
  // stream. In this case we need to perform a noop and return
  // an error.
  //
  if (this._failures >= this.maxRetries) {
    return callback(new Error('Transport is in a failed state.'))
  }

  let output = log({
    level,
    message: String(msg),
    meta,
    json: this.json,
    logstash: this.logstash,
    colorize: this.colorize,
    prettyPrint: this.prettyPrint,
    timestamp: this.timestamp,
    showLevel: this.showLevel,
    stringify: this.stringify,
    label: this.label,
    depth: this.depth,
    formatter: this.formatter,
    humanReadableUnhandledException: this.humanReadableUnhandledException,
  })

  if (typeof output === 'string') {
    output += this.eol
  }

  if (!this.filename) {
    //
    // If there is no `filename` on this instance then it was configured
    // with a raw `WriteableStream` instance and we should not perform any
    // size restrictions.
    //
    this._write(output, callback)
    this._size += output.length
    this._lazyDrain()
  } else {
    this.open((err) => {
      if (err) {
        //
        // If there was an error enqueue the message
        //
        return this._buffer.push([output, callback])
      }

      this._write(output, callback)
      this._size += output.length
      this._lazyDrain()
    })
  }
}

//
// ### function _write (data, cb)
// #### @data {String|Buffer} Data to write to the instance's stream.
// #### @cb {function} Continuation to respond to when complete.
// Write to the stream, ensure execution of a callback on completion.
//
File.prototype._write = function (data, callback) {
  if (this._isStreams2) {
    this._stream.write(data)
    return callback && process.nextTick(() => callback(null, true))
  }

  // If this is a file write stream, we could use the builtin
  // callback functionality, however, the stream is not guaranteed
  // to be an fs.WriteStream.
  const ret = this._stream.write(data)
  if (!callback) return
  if (ret === false) {
    return this._stream.once('drain', () => {
      callback(null, true)
    })
  }
  return process.nextTick(() => callback(null, true))
}

//
// ### function query (options, callback)
// #### @options {Object} Loggly-like query options for this instance.
// #### @callback {function} Continuation to respond to when complete.
// Query the transport. Options object is optional.
//
File.prototype.query = function (opts, callback) {
  let options = opts || {}

  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  const file = path.join(this.dirname, this.filename)
  options = this.normalizeQuery(options)
  let buff = ''
  let results = []
  let row = 0

  const stream = fs.createReadStream(file, {
    encoding: 'utf8',
  })

  const push = (data) => {
    if (options.rows && results.length >= options.rows && options.order != 'desc') {
      if (stream.readable) {
        stream.destroy()
      }
      return
    }

    if (options.fields) {
      const obj = {}
      options.fields.forEach((key) => {
        obj[key] = data[key]
      })
      data = obj
    }

    if (options.order === 'desc') {
      if (results.length >= options.rows) {
        results.shift()
      }
    }
    results.push(data)
  }

  const check = (data) => {
    if (!data) {
      return undefined
    }

    if (typeof data !== 'object') return

    const time = new Date(data.timestamp)
    if ((options.from && time < options.from) || (options.until && time > options.until)) {
      return undefined
    }

    return true
  }

  const add = (buffer, attempt) => {
    try {
      const data = JSON.parse(buffer)
      if (check(data)) push(data)
    } catch (e) {
      if (!attempt) {
        stream.emit('error', e)
      }
    }
  }

  stream.on('error', (err) => {
    if (stream.readable) {
      stream.destroy()
    }
    if (!callback) return
    return err.code !== 'ENOENT' ? callback(err) : callback(null, results)
  })

  stream.on('data', (newData) => {
    const data = (buff + newData).split(/\n+/)
    const lastIndex = data.length - 1

    //    data.forEach((bit) => {
    //      if (!options.start || row >= options.start) {
    //        add(bit)
    //      }
    //      row += 1
    //    })
    for (let i = 0; i < lastIndex; i++) {
      if (!options.start || row >= options.start) {
        add(data[i])
      }
      row += 1
    }

    buff = data[lastIndex]
  })

  stream.on('close', () => {
    if (buff) add(buff, true)
    if (options.order === 'desc') {
      results = results.reverse()
    }
    if (callback) callback(null, results)
  })
}

//
// ### function stream (options)
// #### @options {Object} Stream options for this instance.
// Returns a log stream for this transport. Options object is optional.
//
File.prototype.stream = function (opts) {
  const file = path.join(this.dirname, this.filename)
  const options = opts || {}
  const stream = new Stream()

  const tail = {
    file,
    start: options.start,
  }

  stream.destroy = tailFile(tail, (err, line) => {
    if (err) {
      stream.emit('error', err)
      return
    }

    try {
      stream.emit('data', line)
      stream.emit('log', JSON.parse(line))
    } catch (e) {
      e.message = line
      stream.emit('error', e)
    }
  })

  return stream
}

//
// ### function open (callback)
// #### @callback {function} Continuation to respond to when complete
// Checks to see if a new file needs to be created based on the `maxsize`
// (if any) and the current size of the file used.
//
File.prototype.open = function (callback) {
  if (this.opening) {
    //
    // If we are already attempting to open the next
    // available file then respond with a value indicating
    // that the message should be buffered.
    //
    return callback(true)
  } else if (!this._stream || (this.maxsize && this._size >= this.maxsize)) {
    //
    // If we dont have a stream or have exceeded our size, then create
    // the next stream and respond with a value indicating that
    // the message should be buffered.
    //
    callback(true)
    return this._createStream()
  }

  this._archive = this.zippedArchive ? this._stream.path : null

  //
  // Otherwise we have a valid (and ready) stream.
  //
  callback()
}

//
// ### function close ()
// Closes the stream associated with this instance.
//
File.prototype.close = function () {
  if (this._stream) {
    this._stream.end()
    this._stream.destroySoon()

    this._stream.once('finish', () => {
      this.emit('flush')
      this.emit('closed')
    })
  }
}

//
// ### function flush ()
// Flushes any buffered messages to the current `stream`
// used by this instance.
//
File.prototype.flush = function () {
  // If nothing to flush, there will be no "flush" event from native stream
  // Thus, the "open" event will never be fired (see _createStream.createAndFlush function)
  // That means, this.opening will never set to false and no logs will be written to disk
  if (!this._buffer.length) {
    return this.emit('flush')
  }

  //
  // Iterate over the `_buffer` of enqueued messaged
  // and then write them to the newly created stream.
  //
  this._buffer.forEach((item) => {
    const str = item[0],
      callback = item[1]

    process.nextTick(() => {
      this._write(str, callback)
      this._size += str.length
    })
  })

  //
  // Quickly truncate the `_buffer` once the write operations
  // have been started
  //
  this._buffer.length = 0

  //
  // When the stream has drained we have flushed
  // our buffer.
  //
  this._stream.once('drain', () => {
    this.emit('flush')
    this.emit('logged')
  })
}

//
// ### @private function _createStream ()
// Attempts to open the next appropriate file for this instance
// based on the common state (such as `maxsize` and `_basename`).
//
File.prototype._createStream = function () {
  this.opening = true

  const checkFile = (target) => {
    const fullname = path.join(this.dirname, target)

    //
    // Creates the `WriteStream` and then flushes any
    // buffered messages.
    //
    const createAndFlush = (size) => {
      if (this._stream) {
        this._stream.end()
        this._stream.destroySoon()
      }

      this._size = size
      this.filename = target
      this._stream = fs.createWriteStream(fullname, this.options)
      this._isStreams2 = isWritable(this._stream)
      this._stream.on('error', (error) => {
        if (this._failures < this.maxRetries) {
          this._createStream()
          this._failures++
        } else {
          this.emit('error', error)
        }
      })
      //
      // We need to listen for drain events when
      // write() returns false. This can make node
      // mad at times.
      //
      this._stream.setMaxListeners(Infinity)

      //
      // When the current stream has finished flushing
      // then we can be sure we have finished opening
      // and thus can emit the `open` event.
      //
      this.once('flush', () => {
        // Because "flush" event is based on native stream "drain" event,
        // logs could be written inbetween "this.flush()" and here
        // Therefore, we need to flush again to make sure everything is flushed
        this.flush()

        this.opening = false
        this.emit('open', fullname)
      })
      //
      // Remark: It is possible that in the time it has taken to find the
      // next logfile to be written more data than `maxsize` has been buffered,
      // but for sensible limits (10s - 100s of MB) this seems unlikely in less
      // than one second.
      //
      this.flush()
      compressFile()
    }

    const compressFile = () => {
      if (this._archive) {
        const gzip = zlib.createGzip()

        const inp = fs.createReadStream(String(this._archive))
        const out = fs.createWriteStream(`${this._archive}.gz`)

        inp.pipe(gzip).pipe(out)

        fs.unlink(String(this._archive))
        this._archive = ''
      }
    }

    fs.stat(fullname, (err, stats) => {
      if (err) {
        if (err.code !== 'ENOENT') {
          return this.emit('error', err)
        }
        return createAndFlush(0)
      }

      if (!stats || (this.maxsize && stats.size >= this.maxsize)) {
        //
        // If `stats.size` is greater than the `maxsize` for
        // this instance then try again
        //
        return this._incFile(() => {
          checkFile(this._getFile())
        })
      }

      createAndFlush(stats.size)
    })
  }

  checkFile(this._getFile())
}

File.prototype._incFile = function (callback) {
  const ext = path.extname(this._basename)
  const basename = path.basename(this._basename, ext)

  if (!this.tailable) {
    this._created += 1
    this._checkMaxFilesIncrementing(ext, basename, callback)
  } else {
    this._checkMaxFilesTailable(ext, basename, callback)
  }
}

//
// ### @private function _getFile ()
// Gets the next filename to use for this instance
// in the case that log filesizes are being capped.
//
File.prototype._getFile = function () {
  const ext = path.extname(this._basename)
  const basename = path.basename(this._basename, ext)

  //
  // Caveat emptor (indexzero): rotationFormat() was broken by design
  // when combined with max files because the set of files to unlink
  // is never stored.
  //
  return !this.tailable && this._created
    ? basename + (this.rotationFormat ? this.rotationFormat() : this._created) + ext
    : basename + ext
}

//
// ### @private function _checkMaxFilesIncrementing ()
// Increment the number of files created or
// checked by this instance.
//
File.prototype._checkMaxFilesIncrementing = function (ext, basename, callback) {
  if (this.zippedArchive) {
    this._archive = path.join(this.dirname, basename + (this._created === 1 ? '' : this._created - 1) + ext)
  }

  // Check for maxFiles option and delete file
  if (!this.maxFiles || this._created < this.maxFiles) {
    return callback()
  }

  const oldest = this._created - this.maxFiles
  const target = path.join(
    this.dirname,
    basename + (oldest !== 0 ? oldest : '') + ext + (this.zippedArchive ? '.gz' : ''),
  )
  fs.unlink(target, callback)
}

//
// ### @private function _checkMaxFilesTailable ()
//
// Roll files forward based on integer, up to maxFiles.
// e.g. if base if file.log and it becomes oversized, roll
//    to file1.log, and allow file.log to be re-used. If
//    file is oversized again, roll file1.log to file2.log,
//    roll file.log to file1.log, and so on.
File.prototype._checkMaxFilesTailable = function (ext, basename, callback) {
  const tasks = []

  if (!this.maxFiles) {
    return
  }

  new Array(this.maxFiles)
    .fill(null)
    .map((_, i) => (cb) => {
      const tmppath = path.join(this.dirname, basename + (i - 1) + ext + (this.zippedArchive ? '.gz' : ''))
      fs.exists(tmppath, (exists) => {
        if (!exists) {
          return cb(null)
        }

        return fs.rename(tmppath, path.join(this.dirname, basename + i + ext + (this.zippedArchive ? '.gz' : '')), cb)
      })
    })
    .reverse()
    .forEach(task => tasks.push(task))

  if (this.zippedArchive) {
    this._archive = path.join(this.dirname, basename + 1 + ext)
  }
  async.series(tasks, () => {
    fs.rename(path.join(this.dirname, basename + ext), path.join(this.dirname, basename + 1 + ext), callback)
  })
}

//
// ### @private function _lazyDrain ()
// Lazily attempts to emit the `logged` event when `this.stream` has
// drained. This is really just a simple mutex that only works because
// Node.js is single-threaded.
//
File.prototype._lazyDrain = function () {
  if (!this._draining && this._stream) {
    this._draining = true

    this._stream.once('drain', () => {
      this._draining = false
      this.emit('logged')
    })
  }
}
