<template lang="pug">
  .bucket-box.box
    .top-bar
      .delete-multiple.top-bar-item(@click="multipleDelete") 删除
    .table-title-bar
      .check
        CheckBox.check-box(:value="isCheckAll", :size="12")
      .name.item 文件路径
      .file.item 文件大小
      .type.item 文件类型
      .time.item 上传时间
      .tool.item 操作
    .file-box(v-if="fileList")
      .table-panel-bar(v-for="item in fileList")
        .check.table-panel-bar-item
          CheckBox.check-box(v-model="item.isCheck", :size="12")
        .name.item.table-panel-bar-item {{item.key}}
        .file.item.table-panel-bar-item {{getFileSize(item.fsize)}}
        .type.item.table-panel-bar-item {{item.mimeType}}
        .time.item.table-panel-bar-item {{new Date(item.putTime / 10000).toLocaleString()}}
        .tool.item.table-panel-bar-item
          .tool-item(@click="deleteItem(item)") 删除
</template>

<script>
  import CheckBox from 'check-puge'
  import localforage from 'localforage'
  import { get, generateAccessToken, encodedEntryURI } from '../sdk/index.js'
  const axios = require('axios')
  export default {
    name: 'bucket',
    components: {
      CheckBox
    },
    data () {
      return {
        isCheckAll: false,
        fileList: null,
        mac: null
      }
    },
    created () {
      localforage.getItem('config', (err, mac) => {
        if (err) alert(err)
        else {
          console.log(`读取到密钥`, mac)
          this.mac = mac
          this.getBucket()
        }
      })
    },
    methods: {
      getBucket () {
        this.fileList = null
        const path = `/list?bucket=${this.$route.params.id}`
        const authorization = generateAccessToken(this.mac, 'http://rsf.qbox.me' + path)
        get(`http://127.0.0.1:3000/resourceList?Authorization=${authorization}&path=${encodeURIComponent(path)}`, (bucketData) => {
          if (bucketData.error) {
            alert(bucketData.error)
          } else {
            console.log(bucketData)
            this.fileList = bucketData.items
          }
        })
      },
      getFileSize (size) {
        if (size <= 1048576) {
          return (size / 1024).toFixed(2) + 'kb'
        } else if (size <= 1073741824) {
          return (size / 1048576).toFixed(2) + 'mb'
        } else {
          return (size / 1073741824).toFixed(2) + 'gb'
        }
      },
      deleteItem (item) {
        const path = `/delete/${encodedEntryURI(`${this.$route.params.id}:${item.key}`)}`
        const authorization = generateAccessToken(this.mac, 'http://rs.qiniu.com' + path)
        get(`http://127.0.0.1:3000/delete?Authorization=${authorization}&path=${encodeURIComponent(path)}`, () => {
          this.getBucket()
        })
      },
      // 多选删除
      multipleDelete () {
        let tempList = []
        this.fileList.forEach(element => {
          if (element.isCheck) tempList.push(`op=/delete/` + encodedEntryURI(`${this.$route.params.id}:${element.key}`))
        })
        // console.log(tempList.join('&'))
        const path = `/batch`
        const authorization = generateAccessToken(this.mac, 'http://rs.qiniu.com' + path, tempList.join('&'))
        axios.post(`http://127.0.0.1:3000/batch?Authorization=${authorization}&path=${encodeURIComponent(path)}`, {
          data: tempList.join('&')
        }).then((res) => {
          console.log(res)
        })
      }
    },
    watch: {
      '$route.fullPath' () {
        this.getBucket()
      }
    }
  }
</script>

<style lang="less">
  .file-box {
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
  }
  .table-title-bar {
    background-color: aqua;
    color: dodgerblue;
  }
  .table-panel-bar {
    border-bottom: 1px solid #ccc;
  }
  .table-title-bar, .table-panel-bar {
    display: flex;
    height: 30px;
    line-height: 30px;
    .check {
      width: 30px;
      border-left: 1px solid #ccc;
    }
    .name {
      width: calc(~"100% - 660px");
    }
    .file {
      width: 100px;
      text-align: right;
    }
    .type {
      width: 200px;
    }
    .time {
      width: 200px;
    }
    .tool {
      width: 100px;
      border-right: 1px solid #ccc;
    }
    .table-panel-bar-item {
      border-right: 1px solid #ccc;
    }
    .item {
      padding: 0 10px;
    }
  }
  table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    tr {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #ccc;
    }
    th {
      text-align: left;
    }
    thead {
      background-color: chartreuse;
    }
  }
  .check-box {
    margin: 6px;
  }
  .top-bar {
    height: 30px;
    background-color: skyblue;
    .top-bar-item {
      cursor: pointer;
    }
  }
</style>