<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning"
                show-icon :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类： </span>
          <el-cascader
                  v-model="selectedCateKeys"
                  :options="cateList"
                  :props="cateProps"
                  @change="handleChange"
                  expand-trigger="hover"
                  clearable change-on-select>
          </el-cascader>

        </el-col>
      </el-row>
      <!--页签-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!--动态参数列表-->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--循环渲染标签-->
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index" closable @close="handleClose(index,scope.row)">
                  {{item}}
                </el-tag>
                <!--添加标签-->
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">
                  + New Tag
                </el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" sizi="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" sizi="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--循环渲染标签-->
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index" closable @close="handleClose(index,scope.row)">
                  {{item}}
                </el-tag>
                <!--添加标签-->
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">
                  + New Tag
                </el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" sizi="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" sizi="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数对话框-->
    <el-dialog
          :title="'添加' + titleText"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="addDialogClosed">
    <el-form :model="addForm"
             :rules="addFormRules"
             ref="addFormRef"
             label-width="100px">
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
  </el-dialog>
    <!--编辑参数对话框-->
    <el-dialog
            :title="'修改' + titleText"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Params",
    data() {
      return {
        cateList: [],
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        selectedCateKeys: [],
        activeName: 'many',
        manyTableData: [],
        onlyTableData: [],
        addDialogVisible: false,
        addForm: {
          attr_name: ''
        },
        addFormRules:{
          attr_name: [
            {required: true, message:'请输入参数名称', trigger: 'blur'}
          ]
        },
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          attr_name: [
            {required: true, message:'请输入参数名称', trigger: 'blur'}
          ]
        },

      }
    },
    created() {
      this.getCateList()
    },
    computed: {
      isBtnDisabled() {
        if(this.selectedCateKeys.length !== 3) return true
        return false
      },
      cateId() {
        if(this.selectedCateKeys.length === 3){
          return this.selectedCateKeys[2]
        }
        return null
      },
      titleText(){
        if(this.activeName === 'many') return '动态参数'
        return '静态属性'
      }
    },
    methods: {
      async getCateList() {
        const {data: res} = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.cateList = res.data
        console.log(res);
      },
      handleChange() {
        this.getParamsData()
      },
      handleTabClick() {
        this.getParamsData()
      },
      async getParamsData() {
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          this.manyTableData = []
          this.onlyTableData = []
          return this.selectedCateKeys = []
        }
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {sel: this.activeName}
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals?item.attr_vals.split(' '):[]
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') this.manyTableData = res.data
        else this.onlyTableData = res.data
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      addParams() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 201) {
            return this.$message.error('添加参数失败')
          }
          this.$message.success('添加参数成功')
          this.addDialogVisible = false
          this.getParamsData()
        })
      },
      async showEditDialog(id) {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
          params: {attr_sel: this.activeName}
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数信息失败')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      editParams() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 200) {
            return this.$.message.error('修改参数失败')
          }
          this.$message.success('修改参数成功')
          this.getParamsData()
        })
      },
      async removeParams(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        if(res.meta.status !== 200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getParamsData()
      },
      showInput(row){
        row.inputVisible = true
        this.$nextTick(_ =>{
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      async saveAttrVals(row){
        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        if(res.meta.status !== 200){
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
      },
      async handleInputConfirm(row){
        if(row.inputValue.trim().length === 0){
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        //前端处理
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveAttrVals(row)
      },
      handleClose(i,row){
        row.attr_vals.splice(i,1)
        this.saveAttrVals(row)
      }
    }
  }
</script>

<style scoped>
.input-new-tag{
  width: 120px;
}
</style>