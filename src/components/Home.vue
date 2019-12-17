<!-- home -->
<template>
  <div>
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
import { clearStorage } from '../utils/localstorage'
export default {
  props: {

  },
  data() {
    return {

    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    loginOut () {
      clearStorage()
      this.$router.push('/login')
    }
  },
  components: {

  }
}
</script>

<style scoped lang="less">

</style>
