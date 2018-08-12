'use strict'
const cors = require('cors')
const http = require('http')
const qiniu = require('qiniu')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// const accessKey = '87yjzJIDfD6dbQ00kN5_ZOHc4R7cqwQAgf0MveTI'
// const secretKey = 'a1VbzukR8CnZ-GVoGYKNWOd3obthidAzgXikWhuz'

// const bucket = 'blog'
// const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

// const options = {
//   scope: bucket,
// }
// const putPolicy = new qiniu.rs.PutPolicy(options)
// // 获取上传凭证
// const uploadToken = putPolicy.uploadToken(mac)
// // 获取认证凭证
// const authorization = qiniu.util.generateAccessToken(mac, 'http://coolaf.com/tool/ajaxgp')
// // 覆盖上传凭证
// console.log(authorization)


app.get('/getBucketsList', (req, res) => {
  const Authorization = req.query.Authorization
  console.log(Authorization)
  // 向七牛云存储发出请求
  if (Authorization) {    
    const options = {
      hostname: 'rs.qbox.me',
      port: 80,
      path: '/buckets',
      method: 'GET',
      headers: {
        'Authorization': Authorization
      }
    }
    
    const req = http.get(options, (qiniuRes) => {
      qiniuRes.setEncoding('utf8')
      let rawData = '';
      qiniuRes.on('data', (chunk) => { rawData += chunk; });
      qiniuRes.on('end', () => {
        try {
          res.send(rawData)
        } catch (e) {
          console.error(e.message)
        }
      })
    })
  } else {
    res.send('{"error":"no Authorization"}')
  }
})

app.get('/resourceList', (req, res) => {
  const Authorization = req.query.Authorization
  console.log(Authorization)
  // 向七牛云存储发出请求
  if (Authorization) {
    const options = {
      hostname: 'rsf.qbox.me',
      port: 80,
      path: decodeURIComponent(req.query.path),
      method: 'GET',
      headers: {
        'Authorization': Authorization
      }
    }
    console.log(options)
    http.get(options, (qiniuRes) => {
      qiniuRes.setEncoding('utf8')
      let rawData = '';
      qiniuRes.on('data', (chunk) => { rawData += chunk; });
      qiniuRes.on('end', () => {
        try {
          res.send(rawData)
        } catch (e) {
          console.error(e.message)
        }
      })
    })
  }
})
// 删除单个文件
app.get('/delete', (req, res) => {
  const Authorization = req.query.Authorization
  console.log(`删除资源:${decodeURIComponent(req.query.path)}`)
  if (Authorization) {
    const options = {
      hostname: 'rs.qiniu.com',
      port: 80,
      path: decodeURIComponent(req.query.path),
      method: 'GET',
      headers: {
        'Authorization': Authorization
      }
    }
    http.get(options, (qiniuRes) => {
      qiniuRes.setEncoding('utf8')
      let rawData = '';
      qiniuRes.on('data', (chunk) => { rawData += chunk; });
      qiniuRes.on('end', () => {
        try {
          // 七牛服务器不知道为什么成功会返回空，错误处理
          if (rawData === '') {
            rawData = '{}'
          }
          res.send(rawData)
        } catch (e) {
          console.error(e.message)
        }
      })
    })
  }
})

// 批量操作
app.post('/batch', (req, res) => {
  const Authorization = req.query.Authorization
  const postData = req.body.data
  if(!postData) res.send('no data!')
  console.log(postData)
  if (Authorization) {
    const options = {
      hostname: 'rs.qiniu.com',
      port: 80,
      path: decodeURIComponent(req.query.path),
      method: 'POST',
      headers: {
        'Authorization': Authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }
    const qiniuReq = http.request(options, (qiniuRes) => {
      qiniuRes.setEncoding('utf8');
      qiniuRes.on('data', (chunk) => {
        res.send(chunk)
      })
    })
    qiniuReq.write(postData)
    qiniuReq.end()
  }
})

const server = app.listen(3000, () => {
  console.log('程序正在监听3000端口')
})