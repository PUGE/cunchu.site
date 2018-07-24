<template lang="pug">
  .bucket-box.box
    .file-box
      File.folder(v-for="item in folder", :name="item", :key="item")
</template>

<script>
  import localforage from 'localforage'
  import File from '@/components/File'
  import { get, generateAccessToken } from '../sdk/index.js'
  export default {
    name: 'bucket',
    components: {
      File
    },
    data () {
      return {
        folder: []
      }
    },
    created () {
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
              }
              console.log(bucketData)
            }
          })
        }
      })
    },
    methods: {
    }
  }
</script>

<style lang="less">
  .file-box {
    display: flex;
  }
</style>