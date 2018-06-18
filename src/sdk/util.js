const url = require('url')
const crypto = require('crypto')

function hmacSha1 (encodedFlags, secretKey) {
  const hmac = crypto.createHmac('sha1', secretKey)
  hmac.update(encodedFlags)
  return hmac.digest('base64')
}

function base64ToUrlSafe (v) {
  return v.replace(/\//g, '_').replace(/\+/g, '-');
}

export function generateAccessToken (mac, requestURI, reqBody) {
  const u = url.parse(requestURI)
  const path = u.path
  let access = path + '\n'
  if (reqBody) {
    access += reqBody
  }
  var digest = hmacSha1(access, mac.secretKey)
  var safeDigest = base64ToUrlSafe(digest)
  return 'QBox ' + mac.accessKey + ':' + safeDigest
}

export function get (url, fn){
  const obj = new XMLHttpRequest()        
  obj.open('GET', url, true)
  obj.onreadystatechange=function(){
    if (obj.readyState === 4 && obj.status === 200 || obj.status === 304) {
      fn.call(this, JSON.parse(obj.responseText))
    }
  }
  obj.send(null)
}
