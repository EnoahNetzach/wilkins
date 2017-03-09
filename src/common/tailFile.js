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
  const buffer = new Buffer(64 * 1024)
  const decode = new StringDecoder('utf8')
  const stream = new Stream()
  let buff = ''
  let pos = 0
  let row = 0

  if (options.start === -1) {
    delete options.start
  }

  stream.readable = true
  stream.destroy = function () {
    stream.destroyed = true
    stream.emit('end')
    stream.emit('close')
  }

  function read(fd) {
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
          row += 1
          buff = ''
        }
        return setTimeout(read, 1000)
      }

      let data = decode.write(buffer.slice(0, bytes))

      if (!callback) {
        stream.emit('data', data)
      }

      data = (buff + data).split(/\n+/)
      const lastIndex = data.length - 1

      data.forEach((bit) => {
        if (options.start == null || row > options.start) {
          if (!callback) {
            stream.emit('line', bit)
          } else {
            callback(null, bit)
          }
        }
        row += 1
      })

      buff = data[lastIndex]

      pos += bytes

      return read(fd)
    })
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

    read(fd)
  })

  if (!callback) {
    return stream
  }

  return stream.destroy
}
