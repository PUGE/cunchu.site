<template lang="pug">
  .file
    img.icon(src="@/assets/icon/file_html.svg")
    .name {{name}}
</template>

<script>
  export default {
    props: {
      name: String
    }
  }
</script>

<style lang="less">
  .file {
    width: 100px;
    height: 110px;
    padding: 5px;
    margin: 5px;
  }
  .file:hover {
    background-color: gainsboro;
  }
  .icon {
    height: 90px;
    width: 100px;
    cursor: pointer;
  }
  .name {
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    text-align: center;
  }
</style>