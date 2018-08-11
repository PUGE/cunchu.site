import { get, generateAccessToken } from "./util"
import { mac } from "./auth"

// Base64编码方法
function encodedEntryURI (str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1)
  }))
}

export {
  get,
  mac,
  generateAccessToken,
  encodedEntryURI
}