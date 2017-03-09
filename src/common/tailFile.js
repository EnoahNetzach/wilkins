/*
 * common.js: Internal helper and utility functions for wilkins
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

import fs from 'fs'
import { StringDecoder } from 'string_decoder'
import { Stream } from 'stream'

//
// ### function tailFile (options, callback)
// #### @options {Object} Options for tail.
// #### @callback {function} Callback to execute on every line.
// `tail -f` a file. Options must include file.
//
module.exports = function (options, callback) {
  var buffer = new Buffer(64 * 1024),
    decode = new StringDecoder('utf8'),
    stream = new Stream(),
    buff = '',
    pos = 0,
    row = 0

  if (options.start === -1) {
    delete options.start
  }

  stream.readable = true
  stream.destroy = function () {
    stream.destroyed = true
    stream.emit('end')
    stream.emit('close')
  }

  fs.open(options.file, 'a+', '0644', (err, fd) => {
    if (err) {
      if (!callback) {
        stream.emit('error', err)
      } else {
        callback(err)
      }
      stream.destroy()
      return
    }

    function read() {
      if (stream.destroyed) {
        fs.close(fd)
        return undefined
      }

      return fs.read(fd, buffer, 0, buffer.length, pos, (err, bytes) => {
        if (err) {
          if (!callback) {
            stream.emit('error', err)
          } else {
            callback(err)
          }
          stream.destroy()
          return undefined
        }

        if (!bytes) {
          if (buff) {
            if (options.start == null || row > options.start) {
              if (!callback) {
                stream.emit('line', buff)
              } else {
                callback(null, buff)
              }
            }
            row++
            buff = ''
          }
          return setTimeout(read, 1000)
        }

        var data = decode.write(buffer.slice(0, bytes))

        if (!callback) {
          stream.emit('data', data)
        }

        var data = (buff + data).split(/\n+/),
          l = data.length - 1,
          i = 0

        for (; i < l; i++) {
          if (options.start == null || row > options.start) {
            if (!callback) {
              stream.emit('line', data[i])
            } else {
              callback(null, data[i])
            }
          }
          row++
        }

        buff = data[l]

        pos += bytes

        return read()
      })
    }

    read()
  })

  if (!callback) {
    return stream
  }

  return stream.destroy
}
