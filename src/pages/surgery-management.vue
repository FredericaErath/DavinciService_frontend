<template>
  <div style="margin-bottom: 2%; margin-left: 87%">
    <el-button
      type="primary"
      size="medium"
      @click="addSurgery"
    >
      <v-icon>mdi-import</v-icon>添加手术
    </el-button>
  </div>
  <el-form
    :model="form"
    size="medium"
    class="form"
  >
    <el-form-item label="手术名称">
      <el-select
        v-model="surgery_name"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="2"
        placeholder="Select"
        style="width: 260px"
      >
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="部门"
      style="margin-left: 10px"
    >
      <el-select
        v-model="department"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="2"
        placeholder="Select"
        style="width: 240px"
      >
        <el-option
          v-for="item in options_d"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="手术时间段"
      style="margin-left: 10px"
    >
      <el-date-picker
        v-model="datetime"
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

  <div>
    <el-table
      :data="tableData"
      stripe
      border
      size="small"
      style="width: 150%; margin-top: 20px"
    >
      <el-table-column
        prop="s_name"
        label="手术名称"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="p_name"
        label="患者姓名"
      >
      </el-table-column>
      <el-table-column
        prop="chief_surgeon"
        label="主刀"
      >
      </el-table-column>
      <el-table-column
        prop="associate_surgeon"
        label="一助"
      >
      </el-table-column>
      <el-table-column
        prop="date"
        label="手术日期"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="admission_number"
        label="住院号"
      >
      </el-table-column>
      <el-table-column
        prop="department"
        label="科室"
      >
      </el-table-column>
      <el-table-column
        prop="instrument_nurse"
        width="110"
        label="器械护士"
      >
      </el-table-column>
      <el-table-column
        prop="circulating_nurse"
        label="巡回护士"
        width="110"
      >
      </el-table-column>
      <el-table-column
        prop="begin_time"
        label="开始时间"
      >
      </el-table-column>
      <el-table-column
        prop="end_time"
        label="结束时间"
      >
      </el-table-column>
      <el-table-column
        prop="instruments"
        label="器械"
        width="120"
      >
        <template #default="scope">
          <el-popover
            effect="light"
            trigger="hover"
            placement="top"
            width="auto"
          >
            <template #default>
              <el-table :data="scope.row.instruments_detail">
                <el-table-column
                  label="id"
                  prop="id"
                ></el-table-column>
                <el-table-column
                  label="器械名称"
                  prop="name"
                ></el-table-column>
                <el-table-column
                  label="剩余次数"
                  prop="times"
                ></el-table-column>
                <el-table-column
                  label="备注"
                  prop="description"
                ></el-table-column>
              </el-table>
            </template>
            <template #reference>
              <el-tag disable-transitions>{{ scope.row.instruments }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="consumables"
        label="耗材"
        width="120"
      >
        <template #default="scope">
          <el-popover
            effect="light"
            trigger="hover"
            placement="top"
            width="auto"
          >
            <template #default>
              <el-table :data="scope.row.consumables_detail">
                <el-table-column
                  label="id"
                  prop="id"
                ></el-table-column>
                <el-table-column
                  label="耗材名称"
                  prop="name"
                ></el-table-column>
                <el-table-column
                  label="备注"
                  prop="description"
                ></el-table-column>
              </el-table>
            </template>
            <template #reference>
              <el-tag disable-transitions>{{ scope.row.consumables }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-link
            @click="onClickRevise(scope.row)"
            :underline="false"
          >
            <v-icon
              size="small"
              class="me-2"
            >
              mdi-pencil
            </v-icon>
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="revise"
      max-width="500px"
    >
      <el-form
        label-position="left"
        :model="form"
        label-width="120px"
      >
        <el-form-item label="手术名称">
          <el-input v-model="form.s_name" />
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input v-model="form.p_name" />
        </el-form-item>
        <el-form-item label="主刀">
          <el-select
            v-model="form.chief_surgeon_id"
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in doc_options"
              :key="item.u_id"
              :label="item.name"
              :value="item.u_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="一助">
          <el-select
            v-model="form.associate_surgeon_id"
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in doc_options"
              :key="item.u_id"
              :label="item.name"
              :value="item.u_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手术日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="住院号">
          <el-input v-model="form.admission_number" />
        </el-form-item>
        <el-form-item label="科室">
          <el-select
            v-model="form.department"
            placeholder="please select your zone"
          >
            <el-option
              v-for="item in d_options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="器械护士">
          <el-select
            :value-key="'u_id'"
            v-model="form.instru_nurse_temp"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in n_options"
              :key="item.u_id"
              :label="item.name"
              :value="item.u_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="巡回护士">
          <el-select
            :value-key="'u_id'"
            v-model="form.circu_nurse_temp"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in n_options"
              :key="item.u_id"
              :label="item.name"
              :value="item.u_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始/结束时间">
          <el-date-picker
            v-model="form.time"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-form-item>
        <el-form-item label="器械">
          <el-table
            :data="form.instruments_detail"
            style="width: 120%"
          >
            <el-table-column
              label="id"
              prop="id"
              width="50"
            ></el-table-column>
            <el-table-column
              label="器械名称"
              prop="name"
              width="120"
            ></el-table-column>
            <el-table-column
              label="剩余次数"
              prop="times"
              width="150"
              ><template #default="scope">
                <el-input-number
                  v-model="scope.row.times"
                  :min="0"
                  :max="12"
                  size="small"
                  :disabled="!add_or_update_flag"
                  controls-position="right"
                  @change="handleChange"
                /> </template
            ></el-table-column>
            <el-table-column
              label="备注"
              prop="description"
              width="150"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.description"
                  placeholder="Please input"
                />
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
            >
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index, form.instruments_detail)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            class="mt-4"
            style="width: 100%"
            @click="onAddItem"
            >添加器械</el-button
          >
          <el-dialog v-model="new_instrument_flag">
            <el-form
              label-position="left"
              :model="new_instrument"
              label-width="120px"
            >
              <el-form-item label="器械">
                <el-select
                  v-model="new_instrument.id"
                  placeholder="Select"
                  filterable
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in i_load_options"
                    :key="item.id"
                    :label="item.id + '号' + item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="备注"
                style="margin-top: 2%"
              >
                <el-input
                  v-model="new_instrument.description"
                  placeholder="Please input"
                />
              </el-form-item>
              <el-form-item style="margin-top: 2%">
                <el-button
                  type="primary"
                  @click="confirmAddInstrument"
                  >更新</el-button
                >
                <el-button @click="closeAddInstrument">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-form-item>

        <el-form-item label="耗材">
          <el-table
            :data="form.consumables_detail"
            style="width: 100%"
          >
            <el-table-column
              label="id"
              prop="id"
              width="50"
            ></el-table-column>
            <el-table-column
              label="耗材名称"
              prop="name"
              width="180"
            ></el-table-column>
            <el-table-column
              label="备注"
              prop="description"
              width="180"
              ><template #default="scope">
                <el-input
                  v-model="scope.row.description"
                  placeholder="Please input"
                /> </template
            ></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
            >
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index, form.consumables_detail)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            class="mt-4"
            style="width: 100%"
            @click="onAddCItem"
            >添加耗材</el-button
          >
          <el-dialog v-model="new_consumable_flag">
            <el-form
              label-position="left"
              :model="new_consumable"
              label-width="120px"
            >
              <el-form-item label="耗材">
                <el-select
                  v-model="new_consumable.id"
                  placeholder="Select"
                  filterable
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in c_load_options"
                    :key="item.id"
                    :label="item.id + '号' + item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="备注"
                style="margin-top: 2%"
              >
                <el-input
                  v-model="new_consumable.description"
                  placeholder="Please input"
                />
              </el-form-item>
              <el-form-item style="margin-top: 2%">
                <el-button
                  type="primary"
                  @click="confirmAddConsumable"
                  >更新</el-button
                >
                <el-button @click="closeAddInstrument">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="reviseItem"
            >更新</el-button
          >
          <el-button @click="closeReviseItem">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div style="display: flex; width: 100%">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="20"
        color="#9155fd"
        small
        background
        layout="prev, pager, next, jumper"
        :total="totalPage"
        style="margin: auto; margin-top: 2%"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { get_consumable, get_instrument, get_surgery, get_users_api, insert_surgery, update_surgery } from '@/axios/api'
import { ElNotification } from 'element-plus'
export default {
  data: () => ({
    revise: false,
    new_instrument_flag: false,
    new_consumable_flag: false,
    add_or_update_flag: false,
    query_data: [],
    datetime: '',
    surgery_name: '',
    pageSize: 20,
    currentPage: 1,
    totalPage: 0,
    department: '',
    new_instrument: { id: '', description: '' },
    new_consumable: { id: '', description: '' },
    form: {},
    defaultform: {},
    options_d: ['肝脾外科', '胃肠外科', '泌尿外科', '胆胰外科', '胸外科', '妇科', '心脏外科'],
    i_options: ['卡迪亚', '电剪', '马里兰', '双极无损', '细持', '超声刀'],
    i_load_options: [],
    c_load_options: [],
    c_options: ['无菌壁套'],
    d_options: ['肝脾外科', '胃肠外科', '泌尿外科', '胆胰外科', '胸外科', '妇科', '心脏外科'],
    doc_options: [],
    doc_options2: [],
    n_options: [],
    options: [
      '腹腔镜脾脏切除术',
      '肺病损切除',
      '半肝切除术',
      '肾部分切除术',
      '肾根治性切除术',
      '肾上腺肿瘤切除',
      '肾切开取石术',
      '输尿管膀胱吻合术',
      '输尿管狭窄段切除吻合术',
    ],
    tableData: [],
  }),

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      get_surgery({ surgery: {} }).then(res => {
        this.query_data = res.data
        this.tableData = this.query_data.slice(0, 20)
        this.totalPage = (Math.floor(this.queryData.length / 20) + 1) * 20
      })
    },
    handleCurrentChange(number) {
      this.tableData = this.query_data.slice(20 * (number - 1), number * 20)
    },
    onSubmit() {
      if (this.surgery_name.length == 0) {
        this.surgery_name = null
      }
      get_surgery({
        begin_time: this.datetime[0],
        end_time: this.datetime[1],
        department: this.department,
        s_name: this.surgery_name,
      }).then(res => {
        this.query_data = res.data
        this.tableData = this.query_data.slice(0, 20)
        this.totalPage = (Math.floor(this.queryData.length / 20) + 1) * 20
      })
    },
    refresh() {
      this.initialize()
      this.datetime = ''
      this.department = []
      this.s_name = []
    },
    deleteRow(index, tableData) {
      tableData.splice(index, 1)
    },
    onAddItem() {
      this.new_instrument_flag = true
    },
    confirmAddInstrument() {
      var instruments = this.i_load_options.map(x => {
        return x['id']
      })
      var idx = instruments.indexOf(this.new_instrument['id'])
      var new_in = this.i_load_options[idx]
      new_in['description'] = this.new_instrument['description']
      this.form.instruments_detail.push(new_in)
      this.new_instrument_flag = false
    },
    closeAddInstrument() {
      this.new_instrument_flag = false
    },
    onAddCItem() {
      this.new_consumable_flag = true
    },
    confirmAddConsumable() {
      var consumables = this.c_load_options.map(x => {
        return x['id']
      })
      var idx = consumables.indexOf(this.new_consumable['id'])
      var new_con = this.c_load_options[idx]
      new_con['description'] = this.new_consumable['description']
      this.form.consumables_detail.push(new_con)
      this.new_consumable_flag = false
    },
    closeAddConsumable() {
      this.new_consumable_flag = false
    },
    addSurgery() {
      this.revise = true
      this.form = { consumables_detail: [], instruments_detail: [] }
      this.c_load_options = []
      this.i_load_options = []
      this.n_options = []
      this.doc_options = []
      get_users_api({ user_type: '护士' }).then(res => {
        this.n_options = res.data
      })
      get_users_api({ user_type: '医生' }).then(res => {
        this.doc_options = res.data
      })
      get_instrument({ validity: true }).then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.i_load_options.push({
            id: res.data[i]['i_id'],
            times: res.data[i]['times'],
            name: res.data[i]['i_name'],
          })
        }
      })
      get_consumable({ validity: true }).then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.c_load_options.push({
            id: res.data[i]['c_id'],
            name: res.data[i]['c_name'],
            description: res.data[i]['description'],
          })
        }
      })
      this.add_or_update_flag = false
    },
    onClickRevise(item) {
      this.add_or_update_flag = true
      item['instru_nurse_temp'] = []
      item.instrument_nurse_detail.forEach(element => {
        item['instru_nurse_temp'].push(element['u_id'])
      })
      item['circu_nurse_temp'] = []
      item.circulating_nurse_detail.forEach(element => {
        item['circu_nurse_temp'].push(element['u_id'])
      })
      item.time = [item.begin_time, item.end_time]
      get_users_api({ user_type: '护士' }).then(res => {
        this.n_options = res.data
      })
      get_users_api({ user_type: '医生' }).then(res => {
        this.doc_options = res.data
      })
      get_instrument({ validity: true }).then(res => {
        var exclude = res.data.map(x => {
          return x['i_id']
        })
        var listA = item.instruments_detail.map(x => {
          return x['id']
        })
        for (var i = 0; i < listA.length; i++) {
          var idx = exclude.indexOf(listA[i])
          exclude.splice(idx, 1)
        }
        for (var i = 0; i < res.data.length; i++) {
          if (exclude.includes(res.data[i]['i_id'])) {
            this.i_load_options.push({
              id: res.data[i]['i_id'],
              times: res.data[i]['times'],
              name: res.data[i]['i_name'],
            })
          }
        }
      })
      get_consumable({}).then(res => {
        var exclude = res.data.map(x => {
          return x['c_id']
        })
        var listA = item.consumables_detail.map(x => {
          return x['id']
        })
        for (var i = 0; i < listA.length; i++) {
          var idx = exclude.indexOf(listA[i])
          exclude.splice(idx, 1)
        }
        for (var i = 0; i < res.data.length; i++) {
          if (exclude.includes(res.data[i]['c_id'])) {
            this.c_load_options.push({
              id: res.data[i]['c_id'],
              name: res.data[i]['c_name'],
              description: res.data[i]['description'],
            })
          }
        }
      })
      this.form = Object.assign({}, item)
      this.revise = true
    },
    reviseItem() {
      if (this.add_or_update_flag == false) {
        insert_surgery({
          begin_time: this.form.time[0],
          end_time: this.form.time[1],
          date: new Date(this.form.date),
          admission_number: this.form.admission_number,
          department: this.form.department,
          s_name: this.form.s_name,
          p_name: this.form.p_name,
          chief_surgeon: this.form.chief_surgeon_id,
          associate_surgeon: this.form.associate_surgeon_id,
          instrument_nurse: this.form.instru_nurse_temp,
          circulating_nurse: this.form.circu_nurse_temp,
          instruments: this.form.instruments_detail,
          consumables: this.form.consumables_detail,
        }).then(res => {
          if (res.status == 200) {
            this.initialize()
            this.c_load_options = []
            this.i_load_options = []
            this.n_options = []
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
      } else {
        update_surgery({
          s_id: this.form.s_id,
          begin_time: this.form.time[0],
          end_time: this.form.time[1],
          date: new Date(this.form.date),
          admission_number: this.form.admission_number,
          department: this.form.department,
          s_name: this.form.s_name,
          p_name: this.form.p_name,
          chief_surgeon: this.form.chief_surgeon_id,
          associate_surgeon: this.form.associate_surgeon_id,
          instrument_nurse: this.form.instru_nurse_temp,
          circulating_nurse: this.form.circu_nurse_temp,
          instruments: this.form.instruments_detail,
          consumables: this.form.consumables_detail,
        }).then(res => {
          if (res.status == 200) {
            this.initialize()
            this.c_load_options = []
            this.i_load_options = []
            this.n_options = []
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
      }

      this.revise = false
    },

    closeReviseItem() {
      this.revise = false
    },
  },
}
</script>
<style>
.form {
  display: flex;
}
</style>


