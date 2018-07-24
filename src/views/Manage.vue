<template lang="pug">
  .manage-box.box
    ManageLeftBar.left(@onClick="bucketChange")
    router-view.right
</template>

<script>
  import ManageLeftBar from '@/components/ManageLeftBar'
  export default {
    name: 'manage',
    components: {
      ManageLeftBar
    },
    methods: {
      bucketChange (bucket) {
        this.$router.push(`/manage/bucket/${bucket}`)
      }
    }
  }
</script>

<style lang="less">
  .left {
    width: 250px;
    height: 100%;
    border-right: 1px solid #e8eaed;
  }
  .manage-box {
    display: flex;
  }
</style>