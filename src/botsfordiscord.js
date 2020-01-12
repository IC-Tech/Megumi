const https = require('https')
const url = require('url')
const path = require('path')
const auth = require('../auth.json')
const config = require('../config.json')

const HR = (...a) => {
  var _url = url.parse(`https://botsfordiscord.com/api/bot/${config.megumi}${a[0]}`)
  var req = https.request({
    hostname: _url.hostname,
    port: 443,
    path: _url.path,
    method: a[2] ? 'POST':'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth.botsfordiscord
    }
  }, (res) => {
    var _ = ''
    res.on('data', d => _ += typeof d != 'string' ? d.toString() : d)
    res.on('end', () => {
      try {
        a[1]([1, JSON.parse(_)])
      }
      catch(e) {
        a[1]([2, e])
      }
    })
  })
  req.on('error', e => a[1]([2, e]))
  if(a[2]) req.write(a[2])
  req.end()
}
const setStats = a => new Promise(_ => HR('', _, `{"server_count":${a}}`))
exports.setStats = setStats
