import util from 'util'
import wilkins from '../wilkins'
import http from 'http'
import https from 'https'
import { Stream } from 'stream'
import { Transport } from './transport'

//
// ### function Http (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Http transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
const Http = exports.Http = function (options) {
  Transport.call(this, options)
  options = options || {}

  this.name = 'http'
  this.ssl = !!options.ssl
  this.host = options.host || 'localhost'
  this.port = options.port
  this.auth = options.auth
  this.path = options.path || ''
  this.agent = options.agent

  if (!this.port) {
    this.port = this.ssl ? 443 : 80
  }
}

util.inherits(Http, wilkins.Transport)

//
// Expose the name of this Transport on the prototype
//
Http.prototype.name = 'http'

//
// ### function _request (options, callback)
// #### @callback {function} Continuation to respond to when complete.
// Make a request to a wilkinsd server or any http server which can
// handle json-rpc.
//
Http.prototype._request = function (options = {}, callback) {
  const auth = options.auth || this.auth
  const path = options.path || this.path || ''

  delete options.auth
  delete options.path

  // Prepare options for outgoing HTTP request
  const req = (this.ssl ? https : http).request({
    host: this.host,
    port: this.port,
    path: `/${path.replace(/^\//, '')}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    agent: this.agent,
    auth: auth ? `${auth.username}:${auth.password}` : '',
  })

  req.on('error', callback)
  req.on('response', (res) => {
    let body = ''

    res.on('data', (chunk) => {
      body += chunk
    })

    res.on('end', () => {
      callback(null, res, body)
    })

    res.resume()
  })

  req.end(new Buffer(JSON.stringify(options), 'utf8'))
}

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Wilkins. Metadata is optional.
//
Http.prototype.log = function (level, msg, meta, callback) {
  if (typeof meta === 'function') {
    callback = meta
    meta = {}
  }

  const options = {
    method: 'collect',
    params: {
      level,
      message: msg,
      meta,
    },
  }

  if (meta) {
    if (meta.path) {
      options.path = meta.path
      delete meta.path
    }

    if (meta.auth) {
      options.auth = meta.auth
      delete meta.auth
    }
  }

  this._request(options, (err, res) => {
    if (res && res.statusCode !== 200) {
      err = new Error(`HTTP Status Code: ${res.statusCode}`)
    }

    if (err) {
      return callback(err)
    }

    // TODO: emit 'logged' correctly,
    // keep track of pending logs.
    this.emit('logged')

    if (callback) {
      return callback(null, true)
    }
  })
}

//
// ### function query (options, callback)
// #### @options {Object} Loggly-like query options for this instance.
// #### @callback {function} Continuation to respond to when complete.
// Query the transport. Options object is optional.
//
Http.prototype.query = function (opts, callback) {
  let options = opts

  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  options = this.normalizeQuery(options)

  options = {
    method: 'query',
    params: options,
  }

  if (options.params.path) {
    options.path = options.params.path
    delete options.params.path
  }

  if (options.params.auth) {
    options.auth = options.params.auth
    delete options.params.auth
  }

  this._request(options, (err, res, body) => {
    if (res && res.statusCode !== 200) {
      err = new Error(`HTTP Status Code: ${res.statusCode}`)
    }

    if (err) return callback(err)

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (e) {
        return callback(e)
      }
    }

    return callback(null, body)
  })
}

//
// ### function stream (options)
// #### @options {Object} Stream options for this instance.
// Returns a log stream for this transport. Options object is optional.
//
Http.prototype.stream = function (opts) {
  let options = opts || {}

  const stream = new Stream()

  options = {
    method: 'stream',
    params: options,
  }

  if (options.params.path) {
    options.path = options.params.path
    delete options.params.path
  }

  if (options.params.auth) {
    options.auth = options.params.auth
    delete options.params.auth
  }

  const req = this._request(options)
  let buff = ''

  stream.destroy = req.destroy

  req.on('data', (newData) => {
    const data = (buff + newData).split(/\n+/)
    const lastIndex = data.length - 1

    data.forEach((bit) => {
      try {
        stream.emit('log', JSON.parse(bit))
      } catch (e) {
        stream.emit('error', e)
      }
    })

    buff = data[lastIndex]
  })

  req.on('error', (err) => {
    stream.emit('error', err)
  })

  return stream
}
