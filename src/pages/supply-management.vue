<template>
  <div style="margin-bottom: 2%; margin-left: 77.7%">
    <el-button
      type="primary"
      size="medium"
      @click="importSupply"
      ><v-icon>mdi-file-import-outline</v-icon>导入耗材</el-button
    >
    <el-dialog
      v-model="importSupply_flag"
      title="批量导入耗材"
    >
      <el-form :model="importSupply_form">
        <el-form-item label="耗材名称">
          <el-select
            v-model="importSupply_form.name"
            collapse-tags
            collapse-tags-tooltip
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in c_options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="导入个数">
          <el-input-number
            v-model="importSupply_form.number"
            :min="0"
            size="small"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item style="margin-top: 2%">
          <el-button
            type="primary"
            @click="confirmAddSupply"
            >更新</el-button
          >
          <el-button @click="closeAddSupply">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-button
      type="primary"
      size="medium"
      @click="deleteSupply"
      style="margin-left: 2%"
      ><v-icon>mdi-delete</v-icon>删除耗材</el-button
    >

    <v-dialog
      v-model="deleteSupply_flag"
      max-width="500px"
    >
      <v-card class="text-center">
        <v-card-title class="text-h5 mb-6">
          <v-icon
            class="mb-5"
            color="error"
            icon="mdi-alert-circle"
            size="80"
          >
          </v-icon>
          <p>确定删除选中耗材吗？</p>
          <p class="mb-4 text-medium-emphasis text-body-2">
            失效耗材将自动报废，但耗材记录依然保留，不建议管理员手动删除
          </p>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <el-button
            type="primary"
            @click="confirmDeleteSupply"
          >
            确认
          </el-button>
          <el-button @click="closeDeleteSupply">取消</el-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <el-form
    :model="form"
    size="medium"
    class="form"
  >
    <el-form-item label="耗材id">
      <el-input
        v-model="form.id"
        placeholder="Input"
        style="width: 160px"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="耗材名称"
      style="margin-left: 10px"
    >
      <el-select
        v-model="form.name"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="2"
        placeholder="Select"
        style="width: 240px"
      >
        <el-option
          v-for="item in c_options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="入库时间"
      style="margin-left: 10px"
    >
      <el-date-picker
        v-model="form.time"
        type="datetimerange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
      />
    </el-form-item>
    <el-form-item style="display: flex; margin-left: 15px">
      <el-button
        type="primary"
        @click="onSubmit"
        >筛选</el-button
      >
      <el-button @click="refresh">取消</el-button>
    </el-form-item>
  </el-form>

  <el-table
    :data="tableData"
    stripe
    border
    size="small"
    @selection-change="handleSelectionChange"
    style="width: 150%; margin-top: 20px"
  >
    <el-table-column
      type="selection"
      width="55"
    />
    <el-table-column
      prop="c_id"
      label="耗材id"
      sortable
    >
    </el-table-column>
    <el-table-column
      prop="c_name"
      label="耗材名称"
    >
    </el-table-column>
    <el-table-column
      prop="insert_time"
      label="入库时间"
      sortable
    >
    </el-table-column>
    <el-table-column
      prop="description"
      label="备注"
    >
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-link
          @click="reviseSupply(scope.$index, scope.row)"
          :underline="false"
          ><v-icon
            size="small"
            class="me-2"
          >
            mdi-pencil
          </v-icon></el-link
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="reviseSupply_flag"
    max-width="500px"
    title="修改耗材"
  >
    <el-form
      :model="revise_supply"
      label-position="left"
    >
      <el-form-item label="耗材id">
        <el-input
          v-model="revise_supply.c_id"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="耗材名称">
        <el-input
          v-model="revise_supply.c_name"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="入库时间">
        <el-input
          v-model="revise_supply.insert_time"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="revise_supply.description"></el-input>
      </el-form-item>
      <el-form-item style="display: flex; margin-left: 15px">
        <el-button
          type="primary"
          @click="confirmReviseSupply"
          >确认</el-button
        >
        <el-button @click="closeReviseSupply">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div style="display: flex; width: 100%">
    <el-pagination
      v-model:current-page="currentPage"
      color="#9155fd"
      :page-size="20"
      small
      background
      layout="prev, pager, next, jumper"
      :total="totalPage"
      style="margin: auto; margin-top: 2%"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { delete_supply, get_consumable, insert_supply, revise_supply } from '@/axios/api'
import { ElNotification } from 'element-plus'
export default {
  data: () => ({
    tableData: [],
    queryData: [],
    selected: [],
    revise_supply: [],
    reviseSupply_flag: false,
    importSupply_flag: false,
    deleteSupply_flag: false,
    importSupply_form: { name: null, number: 0 },
    c_options: ['中心柱无菌套', '无菌壁套', '尖端盖附件'],
    currentPage: 1,
    totalPage: 2,
    form: { id: null, name: null, time: null },
  }),

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      get_consumable({ supply: {} }).then(res => {
        this.queryData = res.data
        this.totalPage = (Math.floor(this.queryData.length / 20) + 1) * 20
        this.tableData = this.queryData.slice(0, 20)
      })
    },
    confirmAddSupply() {
      var form = new FormData()
      form.append('c_name', this.importSupply_form.name)
      form.append('num', this.importSupply_form.number)
      insert_supply(form).then(res => {
        if (res.status == 200) {
          this.initialize()
          ElNotification({
            title: 'Success',
            message: '新增成功！',
            type: 'success',
          })
        } else {
          ElNotification({
            title: 'Error',
            message: '新增失败！请检查输入内容或联系开发人员',
            type: 'Error',
          })
        }
      })
      this.importSupply_flag = false
    },
    closeAddSupply() {
      this.importSupply_flag = false
    },
    importSupply() {
      this.importSupply_flag = true
    },
    deleteSupply() {
      this.deleteSupply_flag = true
    },
    confirmDeleteSupply() {
      var ls_temp = []
      for (var idx = 0; idx < this.selected.length; idx++) {
        ls_temp.push(this.selected[idx]['c_id'])
      }
      delete_supply(ls_temp).then(res => {
        if (res.status == 200) {
          this.initialize()
          ElNotification({
            title: 'Success',
            message: '删除成功！',
            type: 'success',
          })
        } else {
          ElNotification({
            title: 'Error',
            message: '删除失败！请检查输入内容或联系开发人员',
            type: 'Error',
          })
        }
      })
      this.deleteSupply_flag = false
    },
    closeDeleteSupply() {
      this.deleteSupply_flag = false
    },
    reviseSupply(index, item) {
      this.reviseSupply_flag = true
      this.revise_supply = Object.assign({}, item)
    },
    confirmReviseSupply() {
      var formData = new FormData()
      formData.append('c_id', this.revise_supply.c_id)
      formData.append('description', this.revise_supply.description)
      revise_supply(formData).then(res => {
        if (res.status == 200) {
          this.initialize()
          ElNotification({
            title: 'Success',
            message: '修改成功！',
            type: 'success',
          })
        } else {
          ElNotification({
            title: 'Error',
            message: '修改失败！请检查输入内容或联系开发人员',
            type: 'Error',
          })
        }
      })
      this.reviseSupply_flag = false
    },
    closeReviseSupply() {
      this.reviseSupply_flag = false
    },
    onSubmit() {
      var par = {}
      if (this.form.id != null) {
        this.form.id = Number(this.form.id)
      }
      if (this.form.name != null) {
        if (this.form.name.length == 0) {
          this.form.name = null
        }
      }

      if (this.form.time != null) {
        par = {
          c_id: this.form.id,
          c_name: this.form.name,
          begin_time: new Date(this.form.time[0]),
          end_time: new Date(this.form.time[1]),
        }
      } else {
        par = {
          c_id: this.form.id,
          c_name: this.form.name,
        }
      }
      get_consumable(par).then(res => {
        this.queryData = res.data
        this.totalPage = (Math.floor(this.queryData.length / 20) + 1) * 20
        this.tableData = this.queryData.slice(0, 20)
      })
    },
    handleCurrentChange(number) {
      this.tableData = this.queryData.slice(20 * (number - 1), number * 20)
    },
    handleSelectionChange(val) {
      this.selected = val
    },
    refresh() {
      this.initialize()
      this.form = { id: null, name: null, time: [null, null] }
    },
  },
}
</script>
<style>
.form {
  display: flex;
}
</style>


