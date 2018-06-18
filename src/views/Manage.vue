<template lang="pug">
  .manage-box.box
    ManageLeftBar.left
</template>

<script>
  import ManageLeftBar from '@/components/ManageLeftBar'
  export default {
    name: 'manage',
    components: {
      ManageLeftBar
    },
    created () {
    }
  }
</script>

<style lang="less">
  .left {
    width: 250px;
    height: 100%;
    border-right: 1px solid #e8eaed;
  }
</style>