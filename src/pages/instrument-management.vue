<template>
  <div style="margin-bottom: 2%; margin-left: 68%">
    <el-button
      type="primary"
      size="medium"
      @click="addInstru"
    >
      <v-icon>mdi-import</v-icon>手动入库
    </el-button>

    <el-button
      type="primary"
      size="medium"
      @click="importFile = true"
    >
      <v-icon>mdi-file-import-outline</v-icon>批量入库
    </el-button>

    <el-button
      type="primary"
      size="medium"
      @click="dialogDelete1 = true"
      ><v-icon>mdi-delete</v-icon>删除器械</el-button
    >
    <el-dialog
      v-model="importFile"
      max-width="500px"
    >
      <v-alert
        v-model="alert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="purple"
      >
        注意，批量导入时列名必须为：i_name（器械名称），times（使用次数）。times列可以忽略，系统会自动初始化为12次。
      </v-alert>

      <v-spacer></v-spacer>
      <v-file-input
        chips
        type="file"
        v-model="file"
        accept=".xlsx,.csv"
        label="导入xlsx或csv文件"
      ></v-file-input>

      <v-spacer></v-spacer>
      <v-btn
        color="blue-darken-1"
        variant="text"
        @click="closeImport"
        ><v-icon>mdi-cancel</v-icon>取消</v-btn
      >
      <v-btn
        color="blue-darken-1"
        variant="text"
        @click="importConfirm"
        ><v-icon>mdi-download</v-icon> 保存并下载</v-btn
      >
    </el-dialog>

    <el-dialog
      v-model="dialog"
      max-width="500px"
    >
      <el-form label-position="left">
        <el-form-item label="器械名称">
          <el-select
            label="器械名称"
            v-model="editedItem.i_name"
            :disabled="flag"
          >
            <el-option
              v-for="item in c_options"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="次数">
          <el-input v-model="editedItem.times"></el-input>
        </el-form-item>
      </el-form>
      <el-form-item style="display: flex; margin-left: 15px">
        <el-button
          type="primary"
          @click="save"
          v-show="!flag"
          >保存并下载</el-button
        >
        <el-button @click="close">取消</el-button>
        <el-button
          type="primary"
          @click="save"
          v-show="flag"
          >保存</el-button
        >
      </el-form-item>
    </el-dialog>

    <v-dialog
      v-model="dialogDelete1"
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
          <p>确定删除选中器械吗？</p>
          <p class="mb-4 text-medium-emphasis text-body-2">
            失效器械将自动报废，但耗材记录依然保留，不建议管理员手动删除
          </p>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <el-button
            type="primary"
            @click="deleteItemConfirm1"
          >
            确认
          </el-button>
          <el-button @click="closeDelete1">取消</el-button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="downLoad"
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
          <p>确定下载选中器械二维码吗？</p>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="closeDownLoad"
            >取消</v-btn
          >
          <v-btn
            color="purple"
            variant="text"
            @click="downloadQRConfirm"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <el-form
    style="display: flex"
    size="medium"
    class="form"
  >
    <el-form-item label="器械id">
      <el-input
        v-model="form_id"
        placeholder="Input"
        style="width: 160px"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="器械名称"
      style="margin-left: 10px"
    >
      <el-select
        v-model="form_name"
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
        v-model="form_time"
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
    :data="instruments"
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
      prop="i_id"
      label="器械id"
      sortable
    ></el-table-column>
    <el-table-column
      prop="i_name"
      label="器械名称"
    ></el-table-column>
    <el-table-column
      prop="times"
      label="使用次数"
      sortable
    >
      <template #default="scope">
        <v-chip
          :color="getColor(scope.row.times)"
          size="small"
        >
          {{ scope.row.times }}
        </v-chip>
      </template>
    </el-table-column>
    <el-table-column
      prop="insert_time"
      label="入库时间"
      sortable
    ></el-table-column>
    <el-table-column
      prop="validity"
      label="有效性"
    >
      <template #default="scope">
        <v-chip
          :color="getColor2(scope.row.validity)"
          size="small"
        >
          {{ scope.row.validity }}
        </v-chip>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-link
          @click="downLoadQR(scope.row)"
          :underline="false"
          ><v-icon
            size="small"
            class="me-2"
          >
            mdi-download
          </v-icon></el-link
        >
        <el-link
          @click="editItem(scope.row)"
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
import {
  add_instrument,
  delete_instruments,
  download_qrcode,
  get_instrument,
  get_instrument_api,
  revise_instrument,
  upload_instruments,
} from '@/axios/api'
import { ElNotification } from 'element-plus'
export default {
  data: () => ({
    dialog: false,
    importFile: false,
    dialogDelete1: false,
    downLoad: false,
    itemsPerPage: 10,
    currentPage: 1,
    totalPage: 2,
    alert: true,
    isDisabled: true, // 或者 false
    flag: false,
    file: '',
    search: '',
    form_id: null,
    form_name: null,
    form_time: null,
    c_options: ['卡迪亚', '电剪', '马里兰', '双极无损', '细持', '超声刀'],
    selected: [],
    queryData: [],
    headers: [
      {
        title: '器械id',
        align: 'start',
        sortable: false,
        key: 'i_id',
      },
      { title: '器械名称', key: 'i_name' },
      { title: '使用次数', key: 'times' },
      { title: '入库时间', key: 'insert_time' },
      { title: '有效性', key: 'validity' },
      { title: '操作', key: 'actions', sortable: false },
    ],
    instruments: [],
    editedIndex: -1,
    editedItem: {
      i_name: '',
      times: 12,
    },
    tempItem: {},
    defaultItem: {
      i_name: '',
      times: 12,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新器械' : '修改器械'
    },
    pageCount() {
      return Math.ceil(this.desserts.length / this.itemsPerPage)
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      get_instrument_api().then(res => {
        this.queryData = res.data
        this.totalPage = (Math.floor(this.queryData.length / 20) + 1) * 20
        this.instruments = this.queryData.slice(0, 20)
      })
    },
    handleSelectionChange(val) {
      this.selected = val
    },
    getColor(times) {
      if (times < 3) return 'error'
      else if (times < 5) return '#ff9800'
      else return '#626aef'
    },

    getColor2(validity) {
      if (validity == '失效') return 'error'
      else return 'success'
    },

    downLoadQR(item) {
      this.tempItem = item
      this.downLoad = true
    },

    closeDownLoad() {
      this.downLoad = false
    },

    downloadOnePicture(data) {
      let blob = new Blob([data.data], { type: 'application/octet-stream;' })
      let filename = data.headers['content-disposition'].split(';')[1].replace(/[^\d]/g, '') //下载的文件名
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = filename + '.png'
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
    },

    downloadQRConfirm() {
      download_qrcode({ i_id: this.tempItem.i_id }).then(res => {
        console.log(this.tempItem.i_id)
        if (res.status == 200) {
          this.downloadOnePicture(res)
        } else {
          ElNotification({
            title: 'Error',
            message: '下载失败！请联系开发人员',
            type: 'Error',
          })
        }
      })
      this.closeDownLoad()
    },

    editItem(item) {
      this.editedIndex = this.instruments.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.flag = true
    },

    deleteItemConfirm1() {
      var i_ids = []
      this.selected.forEach(element => {
        i_ids.push(element['i_id'])
      })
      delete_instruments({ i_id: i_ids }).then(res => {
        if (res.status == 200) {
          ElNotification({
            title: 'Success',
            message: '删除成功',
            type: 'success',
          })
          this.initialize()
        } else {
          ElNotification({
            title: 'Error',
            message: '批量导入失败！请检查文件内容或联系开发人员',
            type: 'Error',
          })
        }
      })
      this.closeDelete1()
    },

    closeDelete1() {
      this.dialogDelete1 = false
      this.selected = []
    },

    addInstru() {
      this.dialog = true
    },

    importConfirm() {
      var form = new FormData()
      form.append('file', this.file[0])
      upload_instruments(form).then(res => {
        if (res.status == 200) {
          let blob = new Blob([res.data])
          let filename = '二维码' //下载的文件名
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename)
          } else {
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = filename + '.zip'
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
          this.initialize()
          ElNotification({
            title: 'Success',
            message: '批量导入成功！',
            type: 'success',
          })
        } else {
          ElNotification({
            title: 'Error',
            message: '批量导入失败！请检查文件内容或联系开发人员',
            type: 'Error',
          })
        }
      })
      this.closeImport()
    },

    closeImport() {
      this.importFile = false
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    refresh() {
      this.initialize()
      ;(this.form_id = null), (this.form_name = null), (this.form_time = null)
    },
    onSubmit() {
      var par = {}
      if (this.form_id != null) {
        this.form_id = Number(this.form_id)
      }
      if (this.form_name != null) {
        if (this.form_name.length == 0) {
          this.form_name = null
        }
      }
      if (this.form_time != null) {
        par = {
          i_id: this.form_id,
          i_name: this.form_name,
          begin_time: this.form_time[0],
          end_time: this.form_time[1],
        }
      } else {
        par = {
          i_id: this.form_id,
          i_name: this.form_name,
        }
      }
      get_instrument(par).then(res => {
        this.queryData = res.data
        this.totalPage = (Math.floor(this.queryData.length / 20) + 1) * 20
        this.instruments = this.queryData.slice(0, 20)
      })
    },

    save() {
      if (this.flag == false) {
        add_instrument({
          i_name: this.editedItem.i_name,
          times: parseInt(this.editedItem.times),
        }).then(res => {
          if (res.status == 200) {
            this.downloadOnePicture(res)
            this.initialize()
            ElNotification({
              title: 'Success',
              message: '器械入库成功！',
              type: 'success',
            })
          } else {
            ElNotification({
              title: 'Error',
              message: '添加失败，请检查输入信息或联系开发人员',
              type: 'Error',
            })
          }
        })
        this.close()
      } else {
        var temp = this.instruments[this.editedIndex]
        var post = {
          i_id: temp.i_id,
          times: this.editedItem.times,
        }
        revise_instrument(post).then(res => {
          if (res.status == 200) {
            ElNotification({
              title: 'Success',
              message: '器械信息更新成功！',
              type: 'success',
            })
            this.initialize()
          } else {
            ElNotification({
              title: 'Error',
              message: '更新失败，请检查输入信息或联系开发人员',
              type: 'Error',
            })
          }
        })
        this.flag = false
        this.close()
      }
    },
  },
}
</script>
