<!--  -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-table
        :data="usersData"
        height="500"
        border
        style="width: 100%">
        <el-table-column
          prop="username"
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="注册时间"
          :formatter="FormatDateTime">
        </el-table-column>
        <el-table-column
          prop="role_id"
          label="所属角色"
          :formatter="FormatRole">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="isTitle"
      :visible.sync="centerDialogVisible"
      width="40%"
      center>
      <el-form :model="singleData" :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username" class="con">
          <el-input v-model="singleData.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" class="con">
          <el-input v-model="singleData.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" class="con">
          <el-input v-model="singleData.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id" class="con">
          <el-select v-model="singleData.role_id" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item._id"
              :label="item.name"
              :value="item._id">
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
import { getAllUsers, updateUser, addUser, deleteUser } from '../../api/login.js'
import { getAllRoles } from '../../api/role'
import dateFormat from '../../utils/date'
export default {
  props: {

  },
  data() {
    return {
      usersData: [],
      centerDialogVisible: false,
      singleData: {},
      roles: [],
      rules: {},
      isTitle: ''
    }
  },
  computed: {

  },
  created() {
    this.getUsers()
    this.getRoles()
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
        this.roles = res.data
      })
    },
    getUsers() {
      getAllUsers().then(res => {
        if (res.status === 2) {
          this.$router.push('/login')
        }
        this.usersData = res.data
      })
    },
    // 编辑用户
    handleEdit(index, data) {
      this.centerDialogVisible = true
      this.singleData = data
      this.isTitle = '编辑用户'
    },
    // 时间格式化
    FormatDateTime(row, column, cellValue, index) {
      return cellValue ? dateFormat('YYYY-mm-dd HH:MM:SS', new Date(cellValue)) : ''
    },
    // 格式化role
    FormatRole(row, column, cellValue, index) {
      for (let i = 0; i < this.roles.length; i++) {
        if (this.roles[i]._id === cellValue) {
          return this.roles[i].name
        }
      }
    },
    // 删除用户
    handleDelete(index, data) {
      deleteUser({ userId: data._id }).then(res => {
        if (res.status === 1) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    // 添加
    addUser() {
      this.centerDialogVisible = true
      this.singleData = {}
      this.isTitle = '添加用户'
    },
    // 关闭弹窗
    closeWindow(val) {
      this.centerDialogVisible = val
    },
    cancel() {
      this.centerDialogVisible = false
    },
    submit() {
      if (this.isTitle === '添加用户') {
        addUser(this.singleData).then(res => {
          if (res.status === 1) {
            this.centerDialogVisible = false
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
          }
        })
      } else {
        updateUser(this.singleData).then(res => {
          if (res.status === 1) {
            this.centerDialogVisible = false
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
          }
        })
      }
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
