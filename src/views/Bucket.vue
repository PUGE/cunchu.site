<template lang="pug">
  .bucket-box.box
    .file-box
      Folder.folder(v-for="item in folder", :name="item", :key="item")
      File(v-for="item in fileList", :name="item.key", :key="item.key")
</template>

<script>
  import localforage from 'localforage'
  import File from '@/components/File'
  import Folder from '@/components/Folder'
  import { get, generateAccessToken } from '../sdk/index.js'
  export default {
    name: 'bucket',
    components: {
      File,
      Folder
    },
    data () {
      return {
        folder: [],
        fileList: []
      }
    },
    created () {
      this.getBucket()
    },
    methods: {
      getBucket () {
        this.folder = []
        localforage.getItem('config', (err, mac) => {
          if (err) alert(err)
          else {
            // 如果有保存的密钥那么直接进入管理界面
            console.log(`读取到密钥`, mac)
            const path = `/list?bucket=${this.$route.params.id}&delimiter=/`
            const authorization = generateAccessToken(mac, 'http://rsf.qbox.me' + path)
            get(`http://127.0.0.1:3000/resourceList?Authorization=${authorization}&path=${encodeURIComponent(path)}`, (bucketData) => {
              if (bucketData.error) {
                alert(bucketData.error)
              } else {
                if (bucketData.commonPrefixes) {
                  this.folder = bucketData.commonPrefixes
                  this.fileList = bucketData.items
                }
                console.log(bucketData)
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
  }
</style>