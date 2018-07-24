<template lang="pug">
  .manage-left-bar
    .logo
    .bucket(v-for="item in bucketList", @click="getBucketResource(item)") {{item}}
</template>

<script>
  import localforage from 'localforage'
  import { get, generateAccessToken } from '../sdk/index.js'
  export default {
    name: 'manage-left-bar',
    created () {
      localforage.getItem('config', (err, mac) => {
        if (err) alert(err)
        else {
          // 如果有保存的密钥那么直接进入管理界面
          console.log(`读取到密钥`, mac)
          const authorization = generateAccessToken(mac, 'http://rs.qbox.me/buckets')
          get(`http://127.0.0.1:3000/getBucketsList?Authorization=${authorization}`, (bucketData) => {
            if (bucketData.error) {
              alert(bucketData.error)
            } else {
              this.bucketList = bucketData
            }
          })
        }
      })
    },
    data () {
      return {
        bucketList: []
      }
    },
    methods: {
      getBucketResource (bucket) {
        this.$emit('onClick', bucket)
      }
    }
  }
</script>

<style lang="less">
  .logo {
    height: 50px;
    width: 250px;
  }
  .bucket {
    cursor: pointer;
    font-size: 13px;
    color: #202124;
    line-height: 40px;
    padding: 0 20px;
  }
  .bucket:hover {
    background-color: rgb(245, 245, 245)
  }
  .active {
    background-color: #e8f0fe;
  }
</style>