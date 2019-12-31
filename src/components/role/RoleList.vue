<!--  -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addUser">添加角色</el-button>
      <el-button :type="checkId ? 'primary' : 'info'" :disabled="checkId ? false : true" @click="setUser">设置角色权限</el-button>
      <el-table
        :data="rolesData"
        height="500"
        border
        style="width: 100%"
        @current-change="handleSelectionChange">
        <el-table-column
          width="30">
          <template slot-scope="scope">
            <el-radio v-model="checkId" :label="scope.row.checked"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="auth_time"
          label="授权时间"
          width="180"
          :formatter="FormatDateTime">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          :formatter="FormatDateTime">
        </el-table-column>
        <el-table-column
          prop="auth_name"
          label="授权人">
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="centerDialogVisible"
      width="40%"
      center>
      <el-form :model="singleData" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName" class="con">
          <el-input v-model="singleData.roleName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设置权限"
      :visible.sync="ruleShow"
      :show-close="false"
      width="40%"
      center>
      <el-input v-model="chioceData.name" placeholder="请输入内容" disabled style="margin-bottom: 20px;"></el-input>
      <el-tree
        :data="data"
        ref="roleTree"
        show-checkbox
        node-key="path"
        default-expand-all
        :props="defaultProps"
        :default-checked-keys="resourceCheckedKey">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRole">取 消</el-button>
        <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllRoles, addRole, updateRole } from '../../api/role'
import { getStorage, clearStorage } from '../../utils/localstorage'
import dateFormat from '../../utils/date'
import menuList from '../../utils/menuConfig'
import loginUser from '../../utils/verifyToken'
export default {
  props: {

  },
  data() {
    return {
      rolesData: [],
      centerDialogVisible: false,
      singleData: {},
      rules: {},
      checkId: null,
      // 权限是否显示
      ruleShow: false,
      chioceData: {}, // 选中角色
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      resourceCheckedKey: []// 默认选中
    }
  },
  computed: {

  },
  async created() {
    this.getRoles()
    this.data = await menuList()
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    getRoles() {
      getAllRoles().then(res => {
        if (res.status === 2) {
          this.$router.push('/login')
        }
        const dataList = res.data
        dataList.forEach(item => {
          item.checked = false
        })
        this.rolesData = dataList
      })
    },
    FormatDateTime(row, column, cellValue, index) {
      return cellValue ? dateFormat('YYYY-mm-dd HH:MM:SS', new Date(cellValue)) : ''
    },
    // 添加
    addUser() {
      this.centerDialogVisible = true
      this.singleData = {}
    },
    // 关闭弹窗
    closeWindow(val) {
      this.centerDialogVisible = val
    },
    cancel() {
      this.centerDialogVisible = false
    },
    cancelRole() {
      this.$refs.roleTree.setCheckedKeys([])
      this.ruleShow = false
    },
    submit() {
      addRole(this.singleData).then(res => {
        if (res.status === 1) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.centerDialogVisible = false
        }
      })
    },
    handleSelectionChange(row) {
      this.resourceCheckedKey = row.menus
      this.rolesData.forEach(item => {
        if (item._id !== row._id) {
          item.checked = false
        } else {
          item.checked = true
          this.checkId = true
        }
      })
      this.chioceData = row
    },
    setUser() {
      this.ruleShow = true
    },
    async getCheckedNodes() {
      const role = {}
      const menus = []
      role.create_time = this.chioceData.create_time
      role._id = this.chioceData._id
      // 获取本地授权人，解析token
      loginUser(getStorage('token'))
        .then(res => {
          role.auth_name = res.username
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: 'error'
          })
        })
      role.auth_time = new Date().getTime()
      role.name = this.chioceData.name
      const menusNew = this.$refs.roleTree.getCheckedNodes(true)
      menusNew.forEach((item) => {
        menus.push(item.path)
      })
      role.menus = menus
      updateRole(role).then(res => {
        if (res.status === 1) {
          this.ruleShow = false
          const roleName = JSON.parse(getStorage('user_key')).role.name
          if (roleName === res.data.name) {
            this.$router.push('/login')
            clearStorage()
            this.$message({
              showClose: true,
              message: '权限更新，请重新登陆',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
          }
        }
      })
    }
  },
  components: {
  }
}
</script>

<style scoped lang="less">
  .el-card{
    margin-top: 20px;
    .el-table{
      margin-top: 20px;
    }
  }
  .el-form{
    .el-select{
      width: 100%;
    }
  }
</style>
