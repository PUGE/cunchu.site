<template lang="pug">
  .login-box.box
    .login
      .lable AccessKey
      input(v-model="accessKey" placeholder="请输入AccessKey")
      .lable SecretKey
      input(v-model="secretKey" placeholder="请输入SecretKey")
      WaterRipple.login-button(@onClick="login", text="登陆")
</template>

<script>
  import localforage from 'localforage'
  import WaterRipple from 'waterripple'
  import { get, generateAccessToken } from '../sdk/index.js'
  export default {
    name: 'login',
    data () {
      return {
        accessKey: '87yjzJIDfD6dbQ00kN5_ZOHc4R7cqwQAgf0MveTI',
        secretKey: 'a1VbzukR8CnZ-GVoGYKNWOd3obthidAzgXikWhuz'
      }
    },
    components: {
      WaterRipple
    },
    methods: {
      login () {
        const accessKey = this.accessKey
        const secretKey = this.secretKey
        const mac = {
          accessKey,
          secretKey
        }
        const authorization = generateAccessToken(mac, 'http://rs.qbox.me/buckets')
        get(`http://127.0.0.1:3000/buckets?Authorization=${authorization}`, (data) => {
          if (data.error) {
            alert(data.error)
          } else {
            const config = { accessKey, secretKey }
            localforage.setItem('config', config,  (err) => {
              if (err) alert(err)
              else console.log('密钥输入成功！')
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login {
    padding: 25px;
    height: 300px;
    width: 240px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    position: absolute;
    background: #f1f1f1;
    border: 1px solid #e5e5e5;
  }
  .login-button {
    color: white;
    text-align: center;
    position: absolute;
    left: 25px;
    right: 25px;
    bottom: 25px;
    line-height: 40px;
    background-color: #009fe9;
  }
</style>