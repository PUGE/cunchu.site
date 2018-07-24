<template>
  <div class="app">
    <router-view/>
  </div>
</template>

<script>
  import localforage from 'localforage'
  export default {
    name: 'App',
    created () {
      localforage.getItem('config', (err, value) => {
        if (err) alert(err)
        else {
          // 如果没有获取到密钥 不进行跳转
          if (!value) return
          // 如果有保存的密钥那么直接进入管理界面
          console.log(`读取到密钥${value}`)
          this.$router.push(`/manage`)
        }
      })
    }
  }
</script>

<style lang="less">
  html, body, .app, .box {
    height: 100%;
    width: 100%;
    position: relative;
    font-family: "Microsoft YaHei", "Arial", "黑体", "宋体", sans-serif;
    font-size: 14px;
    overflow: hidden;
  }
  body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td {
    margin: 0;
    padding: 0;
  }
  img {
    border: 0;
    vertical-align: top;
    user-select: none;
  }
  @font-face {
    font-family: 'puge';  /* project id 760995 */
    src: url('//at.alicdn.com/t/font_760995_ednzifkexq.eot');
    src: url('//at.alicdn.com/t/font_760995_ednzifkexq.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_760995_ednzifkexq.woff') format('woff'),
    url('//at.alicdn.com/t/font_760995_ednzifkexq.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_760995_ednzifkexq.svg#puge') format('svg');
  }
  .icon {
    font-family: "puge";
    font-style: normal;
    font-weight: normal;
    display: inline-block;
    user-select: none;
  }
  a {
    text-decoration: none;
    color: #666;
    -webkit-user-drag: none;
  }
  a:hover {
    text-decoration: none;
  }
</style>
