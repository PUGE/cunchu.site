<template lang="pug">
  .bucket-box.box
    .file-box(v-if="fileList")
      table(cellspacing="0")
        thead
          tr
            th.check
              CheckBox.check-box(:value="isCheckAll", :size="12")
            th 文件名
            th 文件大小
            th 文件类型
            th 上传时间
        tbody
          tr(v-for="item in fileList")
            th.check
              CheckBox.check-box(:value="isCheckAll", :size="12")
            th {{item.key}}
            th {{item.fsize}}
            th {{item.mimeType}}
            th {{item.putTime}}
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
    display: flex;
    width: 100%;
    height: 100%;
    overflow: auto;
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
    margin: 0 auto;
  }
</style>