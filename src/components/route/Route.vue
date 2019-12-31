<!-- 动态创建路由 -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>路由管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addRouteLeaf" style="margin-top: 20px;">添加路由</el-button>
    <el-tree
      :data="routes"
      node-key="path"
      default-expand-all
      :expand-on-click-node="false"
      :props="defaultProps"
      :render-content="renderContent"
      style="width: 50%;">
    </el-tree>
    <el-dialog
      title="添加路由"
      :visible.sync="routeShow"
      width="40%"
      center>
      <el-form :model="routeData" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="中文名称" prop="authName" class="con">
          <el-input v-model="routeData.authName"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="path" class="con">
          <el-input v-model="routeData.path"></el-input>
        </el-form-item>
        <el-form-item label="是否公用" prop="isPublic" class="con">
          <el-select v-model="routeData.isPublic" placeholder="请选择">
            <el-option
              v-for="item in isTrue"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import menuList from '../../utils/menuConfig'
import { addRoute, editRoute, deleteRoute } from '../../api/route'
export default {
  props: {

  },
  data() {
    return {
      routes: [],
      isLeaf: true,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      routeShow: false,
      routeData: {
        authName: '',
        path: '',
        isPublic: ''
      },
      rules: {},
      isTrue: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      addRoute: {}
    }
  },
  computed: {

  },
  async created() {
    this.routes = await menuList()
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    append(data) {
      this.isLeaf = false
      this.routeShow = true
      this.addRoute = data
    },
    remove(node, data) {
      deleteRoute(data).then(res => {
        if (res.status === 1) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          const oldRouteParent = node.parent.data
          oldRouteParent.forEach((item, index) => {
            if (item.authName === data.authName) {
              oldRouteParent.splice(index, 1)
            }
          })
        }
      })
    },
    edit(node, data) {
      const oldRouteParent = node.parent.data
      let arrChildren = oldRouteParent.children
      arrChildren.forEach((item, index) => {
        if (item.authName === data.authName) {
          oldRouteParent.children.splice(index, 1)
        }
      })
      editRoute(oldRouteParent).then(res => {
        if (res.status === 1) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
        }
      })
    },
    renderContent(h, { node, data, store }) {
      if (node.level === 1) {
        return (
          <span class="custom-tree-node" style="flex: 1;display: flex;align-items: center;justify-content: space-between;font-size: 14px;padding-right: 8px;">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
            </span>
          </span>
        )
      } else {
        return (
          <span class="custom-tree-node" style="flex: 1;display: flex;align-items: center;justify-content: space-between;font-size: 14px;padding-right: 8px;">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.edit(node, data) }>edit</el-button>
            </span>
          </span>
        )
      }
    },
    cancel() {
      this.routeShow = false
    },
    submit() {
      let data = {}
      if (!this.isLeaf) {
        const newChild = {
          authName: this.routeData.authName,
          path: this.routeData.path
        }
        if (this.routeData.isPublic) {
          Object.assign(newChild, {
            isPublic: true
          }, newChild)
        }
        if (!this.addRoute.children) {
          this.$set(this.addRoute, 'children', [])
        }
        this.addRoute.children.push(newChild)
        data = {
          parentName: this.addRoute.authName,
          authName: this.addRoute.authName,
          path: this.addRoute.path,
          isPublic: this.routeData.isPublic,
          children: this.addRoute.children,
          _id: this.addRoute._id
        }
      } else {
        data = {
          parentName: this.routeData.authName,
          authName: this.routeData.authName,
          path: this.routeData.path,
          isPublic: this.routeData.isPublic,
          isLeaf: this.isLeaf
        }
      }
      addRoute(data).then(res => {
        if (res.status === 1) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
        }
      })
      this.routeShow = false
    },
    // 添加叶子路由
    addRouteLeaf() {
      this.routeShow = true
      this.isLeaf = true
    }
  },
  components: {

  }
}
</script>

<style scoped lang="less">
  .el-tree{
    margin-top: 20px;
    padding: 20px;
  }
  .el-select{
    width: 100%;
  }
</style>
