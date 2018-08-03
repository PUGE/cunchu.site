<template lang="pug">
  .bucket-box.box
    .file-box(v-if="fileList")
      .table-title-bar
        .check
          CheckBox.check-box(:value="isCheckAll", :size="12")
        .name 文件路径
        .file 文件大小
        .type 文件类型
        .time 上传时间
        .tool 操作
      .table-panel-bar(v-for="item in fileList")
        .check
          CheckBox.check-box(:value="isCheckAll", :size="12")
        .name {{item.key}}
        .file {{getFileSize(item.fsize)}}
        .type {{item.mimeType}}
        .time {{new Date(item.putTime / 10000).toLocaleString()}}
        .tool 操作
</template>

<script>
  import CheckBox from 'check-puge'
  import localforage from 'localforage'
  import { get, generateAccessToken } from '../sdk/index.js'
  export default {
    name: 'bucket',
    components: {
      CheckBox
    },
    data () {
      return {
        isCheckAll: false,
        fileList: null
      }
    },
    created () {
      this.getBucket()
    },
    methods: {
      getBucket () {
        this.fileList = null
        localforage.getItem('config', (err, mac) => {
          if (err) alert(err)
          else {
            // 如果有保存的密钥那么直接进入管理界面
            console.log(`读取到密钥`, mac)
            const path = `/list?bucket=${this.$route.params.id}`
            const authorization = generateAccessToken(mac, 'http://rsf.qbox.me' + path)
            get(`http://127.0.0.1:3000/resourceList?Authorization=${authorization}&path=${encodeURIComponent(path)}`, (bucketData) => {
              if (bucketData.error) {
                alert(bucketData.error)
              } else {
                console.log(bucketData)
                this.fileList = bucketData.items
              }
            })
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
    height: 100%;
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
      width: 60px;
    }
    .name {
      width: calc(~"100% - 1060px");
    }
    .file {
      width: 200px;
    }
    .type {
      width: 400px;
    }
    .time {
      width: 200px;
    }
    .tool {
      width: 200px;
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
</style>