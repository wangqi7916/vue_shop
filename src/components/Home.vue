<!-- home -->
<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div class="head_title">
        <img src="../assets/logo.png">
        <span>电商管理后台</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width= "isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409Eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath">
          <div v-for="(item, index) in menuRoles" :key="index">
            <div v-if="item.children && item.children.length > 0">
              <el-submenu :index="item.path + ''" :key="item.path">
                <template slot="title">
                  <i :class="iconArr[item.path]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级 -->
                <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.path" @click="saveState(subItem.path)">{{subItem.authName}}</el-menu-item>
              </el-submenu>
            </div>
            <div v-else>
              <!-- 二级 -->
              <el-menu-item :index="item.path" :key="item.path" @click="saveState(item.path)">{{item.authName}}</el-menu-item>
            </div>
          </div>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { clearStorage, setStorage, getStorage } from '../utils/localstorage'
import menuList from '../utils/menuConfig'
export default {
  props: {},
  data() {
    return {
      menuRoles: [],
      iconArr: {
        'users': 'iconfont icon-user',
        'roles': 'iconfont icon-danju'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  computed: {

  },
  async created () {
    this.activePath = getStorage('activePath')
    this.menuRoles = this.getMenuNodes(await menuList())
  },
  mounted () {
  },
  watch: {

  },
  methods: {
    // 获取路有权限列表
    getMenuNodes(menuList) {
      // 登陆用户权限列表
      const userRoles = JSON.parse(getStorage('user_key')).role.menus
      return menuList.reduce((pre, item) => {
        if (this.hasAuth(item, userRoles)) {
          if (!item.children || item.children.length === 0) {
            pre.push(item)
          } else {
            const now = {
              authName: item.authName,
              path: item.path,
              children: []
            }
            item.children.forEach(cItem => {
              if (userRoles.indexOf(cItem.path) !== -1) {
                now.children.push(cItem)
              }
            })
            // 内层遍历判断是否含有子路由
            if (now.children.length > 0) {
              pre.push(now)
            }
          }
        }
        return pre
      }, [])
    },
    // 判断当前登录用户是否有权限
    hasAuth(item, userRoles) {
      const { path, isPublic } = item
      // 是否是admin用户、isPublic是否是true、是否包含在登录的用户item.menus中
      if (isPublic || userRoles.indexOf(path) !== -1) {
        return true
      } else if (item.children && item.children.length > 0) {
        return !!item.children.find(cItem => userRoles.indexOf(cItem.path) !== -1)
      }
      return false
    },
    loginOut () {
      clearStorage()
      this.$router.push('/login')
    },
    // 菜单折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 存储当前路由
    saveState(activePath) {
      setStorage('activePath', activePath)
      this.activePath = activePath
    }
  },
  components: {

  }
}
</script>

<style scoped lang="less">
  .home_container{
    height: 100%;
    .el-header{
      background: #373d41;
      display: flex;
      justify-content: space-between;
      padding-left: 0;
      align-items: center;
      .head_title{
        display: flex;
        align-items: center;
        color:#fff;
        font-size: 20px;
        img{
          width: 40px;
          display: block;
          margin-left: 10px;
        }
      }
    }
    .el-container{
      .el-aside{
        background:#333744;
        .toggle-button{
          background: #4A5064;
          font-size: 10px;
          line-height: 24px;
          text-align: center;
          letter-spacing: 0.2em;
          cursor: pointer;
          color:#fff;
        }
        .iconfont{
          margin-right: 10px;
        }
        .el-menu{
          border: none;
        }
      }
      .el-main{
        background: #eaedf1;
      }
    }
  }
</style>
