const https = require('https')
const url = require('url')
const path = require('path')
const auth = require('../auth.json')
const config = require('../config.json')

const getgif = a => new Promise(_ => {
  var _url = url.parse(`https://api.tenor.com/v1/random?q=${a.q}&contentfilter=${config.image_filter}&key=${auth.tenor}&limit=1`);
  var req = https.request({
    hostname: _url.hostname,
    port: 443,
    path: _url.path,
    method: 'GET'
  }, (res) => {
     res.on('data', d => {
     	try {
	     	d = JSON.parse(typeof d != 'string' ? d.toString() : d)
  	   	_([1, d.results])
  	  }
  		catch(e) {
  			_([2, e])
  		}
    })
  })
  req.on('error', e => _([2, e]))
  req.end()
})
exports.gif = getgif
