
<template>
  <el-form style="display: flex; margin-left: 58%">
    <el-form-item>
      <el-date-picker
        v-model="surgery_time"
        type="datetimerange"
        :shortcuts="shortcuts"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
    /></el-form-item>
    <el-form-item style="display: flex; margin-left: 15px">
      <el-button
        type="primary"
        @click="onSubmit"
        >筛选</el-button
      >
      <el-button @click="refresh">取消</el-button>
    </el-form-item>
  </el-form>
  <el-tabs
    v-model="activeName"
    class="demo-tabs"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="各科统计"
      name="first"
    >
      <div style="display: flex">
        <div
          id="showbars"
          style="width: 600px; height: 500px; margin-top: 20px"
        ></div>
        <div
          id="showorders"
          style="width: 600px; height: 500px; margin-left;: 20px"
        ></div>
      </div>
      <el-table
        style="width: 100%"
        stripe
        :span-method="objectSpanMethod"
        :data="tableData"
      >
        <el-table-column
          label="科别"
          prop="department"
        >
        </el-table-column>
        <el-table-column
          label="例数"
          prop="d_count"
        >
        </el-table-column>
        <el-table-column
          label="主刀医生"
          prop="chief_surgeon"
        >
        </el-table-column>
        <el-table-column
          label="医生例数"
          prop="c_count"
        >
        </el-table-column>
        <el-table-column label="详细数据">
          <template #default="scope">
            <el-link
              @click="checkDetail(scope.row)"
              type="primary"
              >查看</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="check_detail"
        style="width: 1000px"
      >
        <calendar-heatmap
          tooltip-unit="台手术"
          :values="calendar_value"
          :end-date="calendar_end_date"
        ></calendar-heatmap>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane
      label="护士统计"
      name="second"
    >
      <el-table
        style="width: 100%"
        stripe
        :data="tableData1"
      >
        <el-table-column
          label="姓名"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          label="巡回次数"
          prop="count_circulate"
        >
        </el-table-column>
        <el-table-column
          label="洗手次数"
          prop="count_instrument"
        >
        </el-table-column>
        <el-table-column
          label="总数"
          prop="sum"
        >
        </el-table-column>
      </el-table>
    </el-tab-pane>

    <el-tab-pane
      label="器械统计"
      name="third"
    >
      <div style="display: flex; margin-top: 20px">
        <div
          id="showtimeseries1"
          style="width: 650px; height: 300px"
        ></div>
        <div
          id="showtimeseries2"
          style="width: 650px; height: 300px"
        ></div>
      </div>
      <div style="display: flex">
        <el-table
          style="width: 48%; height: 400px"
          stripe
          :data="tableData2"
          :span-method="objectSpanMethod2"
          ><el-table-column
            label="器械名称"
            prop="name"
          ></el-table-column>
          <el-table-column
            label="器械id"
            prop="id"
          ></el-table-column>

          <el-table-column
            label="月份"
            prop="date"
          >
          </el-table-column>
          <el-table-column
            label="使用次数"
            prop="count"
          >
          </el-table-column>
        </el-table>

        <el-table
          style="width: 48%; margin-left: 2%; height: 400px"
          stripe
          :data="tableData3"
          :span-method="objectSpanMethod3"
          ><el-table-column
            label="器械名称"
            prop="name"
          ></el-table-column>
          <el-table-column
            label="器械id"
            prop="id"
          ></el-table-column>
          <el-table-column
            label="月份"
            prop="date"
          >
          </el-table-column>
          <el-table-column
            label="使用次数"
            prop="count"
          >
          </el-table-column>

          <el-table-column
            label="描述"
            prop="description"
          >
          </el-table-column>
        </el-table>
      </div>
      <div style="display: flex; margin-top: 5%">
        <div
          id="showtimeseries3"
          style="width: 650px; height: 300px"
        ></div>
        <div
          id="showtimeseries4"
          style="width: 650px; height: 300px"
        ></div>
      </div>
      <div style="display: flex">
        <el-table
          style="width: 48%; height: 400px"
          stripe
          :data="tableData4"
          :span-method="objectSpanMethod4"
          ><el-table-column
            label="耗材名称"
            prop="name"
          ></el-table-column>
          <el-table-column
            label="月份"
            prop="date"
          >
          </el-table-column>
          <el-table-column
            label="使用次数"
            prop="count"
          >
          </el-table-column>
        </el-table>

        <el-table
          style="width: 48%; margin-left: 2%; height: 400px"
          stripe
          :data="tableData5"
          :span-method="objectSpanMethod5"
        >
          <el-table-column
            label="耗材名称"
            prop="name"
          ></el-table-column>
          <el-table-column
            label="月份"
            prop="date"
          >
          </el-table-column>
          <el-table-column
            label="使用次数"
            prop="count"
          >
          </el-table-column>
          <el-table-column
            label="描述"
            prop="description"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
    <el-tab-pane
      label="效益分析"
      name="fourth"
    >
      <el-table
        style="width: 100%; margin-left: 2%"
        stripe
        show-summary
        :summary-method="getSummaries"
        :data="tableData6"
      >
        <el-table-column
          label="住院号"
          prop="admission_number"
        >
        </el-table-column>
        <el-table-column
          label="病人名称"
          prop="p_name"
        ></el-table-column>
        <el-table-column
          label="手术日期"
          prop="date"
        >
        </el-table-column>

        <el-table-column
          label="科室"
          prop="department"
        >
        </el-table-column>
        <el-table-column
          label="手术名称"
          prop="s_name"
        >
        </el-table-column>
        <el-table-column
          label="主刀医生"
          prop="chief_surgeon"
        >
        </el-table-column>
        <el-table-column
          label="使用器械"
          prop="instruments"
        >
        </el-table-column>
        <el-table-column
          label="使用耗材"
          prop="consumables"
        >
        </el-table-column>
        <el-table-column
          label="实际费用"
          prop="sum"
        >
        </el-table-column>
        <el-table-column
          label="实收费用"
          prop="real_sum"
        >
        </el-table-column>
        <el-table-column
          label="差价"
          prop="gap"
        >
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>
 
<script>
import { get_doctor_contribution, get_surgery_dashobard } from '@/axios/api'
import * as echarts from 'echarts'
import { onMounted } from 'vue'
onMounted(() => {
  init()
})
export default {
  data: () => ({
    activeName: 'first',
    check_detail: false,
    surgery_time: '',
    tableData: '',
    tableData1: '',
    tableData2: '',
    tableData3: '',
    tableData4: '',
    tableData5: '',
    tableData6: '',
    t1_time_series: { xAxis: [], series: [], legend: [] },
    t2_time_series: { xAxis: [], series: [], legend: [] },
    t3_time_series: { xAxis: [], series: [], legend: [] },
    t4_time_series: { xAxis: [], series: [], legend: [] },
    df_total: '',
    all_sum: { total_cost: 0, total_paid: 0, total_gap: 0 },
    department_count: [],
    calendar_value: [],
    calendar_end_date: '',
    top_ten: [],
  }),
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    checkDetail(row) {
      get_doctor_contribution({ df: this.df_total, name: row.chief_surgeon }).then(res => {
        this.calendar_value = res.data
      })
      if (this.surgery_time != '') {
        this.calendar_end_date = this.surgery_time[1]
      } else {
        this.calendar_end_date = Date()
      }
      this.check_detail = true
    },
    refresh() {
      this.top_ten = ''
      this.department_count = []
      this.initialize()
      this.surgery_time = ''
    },
    initialize() {
      get_surgery_dashobard({}).then(res => {
        this.tableData = res.data.surgeon_count
        this.tableData1 = res.data.nurse_count
        this.tableData2 = res.data.instrument_count
        this.tableData3 = res.data.accident_instrument_count
        this.tableData4 = res.data.consumable_count
        this.tableData5 = res.data.accident_consumable_count
        this.tableData6 = res.data.df_benefits
        this.all_sum = res.data.sum_all
        this.t1_time_series = res.data.instrument_time_series
        this.t2_time_series = res.data.instrument_acc_time_series
        this.t3_time_series = res.data.consumable_time_series
        this.t4_time_series = res.data.consumable_acc_time_series
        this.df_total = res.data.df
        this.department_count = res.data.department_count
        this.top_ten = res.data.top_ten
        this.showorders()
        this.showbars()
        this.showtimeseries1()
        this.showtimeseries2()
        this.showtimeseries3()
        this.showtimeseries4()
      })
    },
    onSubmit() {
      get_surgery_dashobard({ begin_time: this.surgery_time[0], end_time: this.surgery_time[1] }).then(res => {
        this.tableData = res.data.surgeon_count
        this.tableData1 = res.data.nurse_count
        this.tableData2 = res.data.instrument_count
        this.tableData3 = res.data.accident_instrument_count
        this.tableData4 = res.data.consumable_count
        this.tableData5 = res.data.accident_consumable_count
        this.tableData6 = res.data.df_benefits
        this.all_sum = res.data.sum_all
        this.t1_time_series = res.data.instrument_time_series
        this.t2_time_series = res.data.instrument_acc_time_series
        this.t3_time_series = res.data.consumable_time_series
        this.t4_time_series = res.data.consumable_acc_time_series
        this.df_total = res.data.df
        this.department_count = res.data.department_count
        this.top_ten = res.data.top_ten
        this.showorders()
        this.showbars()
        this.showtimeseries1()
        this.showtimeseries2()
        this.showtimeseries3()
        this.showtimeseries4()
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        switch (
          column.property // column.property可以匹配它的每一列的命名， 然后赋值
        ) {
          case 'sum':
            sums[index] = this.all_sum.total_cost //值取自后台
            break
          case 'real_sum':
            sums[index] = this.all_sum.total_paid //值取自后台
            break
          case 'gap':
            sums[index] = this.all_sum.total_gap //值取自后台
            break
          default:
            break
        }
      })
      return sums
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex == 1) {
        const currentValue = row[column.property]

        // 获取上一行相同列的值
        const preRow = this.tableData[rowIndex - 1]
        const preValue = preRow ? preRow[column.property] : null

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1
          for (let i = rowIndex + 1; i < this.tableData.length; i++) {
            const nextRow = this.tableData[i]
            const nextValue = nextRow[column.property]
            if (nextValue === currentValue) {
              rowspan++
            } else {
              break
            }
          }
          return { rowspan, colspan: 1 }
        }
      }
    },
    objectSpanMethod3({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex == 1 || columnIndex == 2) {
        const currentValue = row[column.property]

        // 获取上一行相同列的值
        const preRow = this.tableData3[rowIndex - 1]
        const preValue = preRow ? preRow[column.property] : null

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1
          for (let i = rowIndex + 1; i < this.tableData3.length; i++) {
            const nextRow = this.tableData3[i]
            const nextValue = nextRow[column.property]
            if (nextValue === currentValue) {
              rowspan++
            } else {
              break
            }
          }
          return { rowspan, colspan: 1 }
        }
      }
      if (columnIndex === 3) {
        const currentValue = { id: row['id'], date: row['date'], count: row['count'] }
        // 获取上一行相同列的值
        const preRow = this.tableData3[rowIndex - 1]
        const preValue = preRow ? { id: preRow['id'], date: preRow['date'], count: preRow['count'] } : null
        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (JSON.stringify(currentValue) === JSON.stringify(preValue)) {
          return { rowspan: 0, colspan: 0 }
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1
          for (let i = rowIndex + 1; i < this.tableData3.length; i++) {
            const nextRow = this.tableData3[i]
            const nextValue = { id: nextRow['id'], date: nextRow['date'], count: nextRow['count'] }
            if (JSON.stringify(nextValue) === JSON.stringify(currentValue)) {
              rowspan++
            } else {
              break
            }
          }
          return { rowspan, colspan: 1 }
        }
      }
    },
    objectSpanMethod4({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex == 1) {
        const currentValue = row[column.property]

        // 获取上一行相同列的值
        const preRow = this.tableData4[rowIndex - 1]
        const preValue = preRow ? preRow[column.property] : null

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1
          for (let i = rowIndex + 1; i < this.tableData4.length; i++) {
            const nextRow = this.tableData4[i]
            const nextValue = nextRow[column.property]
            if (nextValue === currentValue) {
              rowspan++
            } else {
              break
            }
          }
          return { rowspan, colspan: 1 }
        }
      }
    },
    objectSpanMethod5({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex == 1) {
        const currentValue = row[column.property]

        // 获取上一行相同列的值
        const preRow = this.tableData5[rowIndex - 1]
        const preValue = preRow ? preRow[column.property] : null

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1
          for (let i = rowIndex + 1; i < this.tableData5.length; i++) {
            const nextRow = this.tableData5[i]
            const nextValue = nextRow[column.property]
            if (nextValue === currentValue) {
              rowspan++
            } else {
              break
            }
          }
          return { rowspan, colspan: 1 }
        }
      }
      if (columnIndex === 2) {
        const currentValue = { name: row['name'], date: row['date'], count: row['count'] }
        // 获取上一行相同列的值
        const preRow = this.tableData5[rowIndex - 1]
        const preValue = preRow ? { name: preRow['name'], date: preRow['date'], count: preRow['count'] } : null
        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (JSON.stringify(currentValue) === JSON.stringify(preValue)) {
          return { rowspan: 0, colspan: 0 }
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1
          for (let i = rowIndex + 1; i < this.tableData5.length; i++) {
            const nextRow = this.tableData5[i]
            const nextValue = { name: nextRow['name'], date: nextRow['date'], count: nextRow['count'] }
            if (JSON.stringify(nextValue) === JSON.stringify(currentValue)) {
              rowspan++
            } else {
              break
            }
          }
          return { rowspan, colspan: 1 }
        }
      }
    },
    objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex == 1) {
        const currentValue = row[column.property]

        // 获取上一行相同列的值
        const preRow = this.tableData2[rowIndex - 1]
        const preValue = preRow ? preRow[column.property] : null

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1
          for (let i = rowIndex + 1; i < this.tableData2.length; i++) {
            const nextRow = this.tableData2[i]
            const nextValue = nextRow[column.property]
            if (nextValue === currentValue) {
              rowspan++
            } else {
              break
            }
          }
          return { rowspan, colspan: 1 }
        }
      }
    },

    showorders() {
      // 基于准备好的dom，初始化echarts实例
      var chartDom = document.getElementById('showorders')
      var myChart = echarts.init(chartDom)
      // 指定图表的配置项和数据
      var option

      option = {
        title: {
          text: '手术量排名图',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: this.top_ten[1],
        },
        series: [
          {
            name: '手术量',
            type: 'bar',
            data: this.top_ten[0],
          },
        ],
      }
      option && myChart.setOption(option)
    },
    showbars() {
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '科室手术量占比图',
          left: 'left',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            name: '科室',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: this.department_count,
          },
        ],
      }
      var chartDom = document.getElementById('showbars')
      var myChart = echarts.init(chartDom)
      option && myChart.setOption(option)
    },
    showtimeseries1() {
      var option = {
        legend: {
          data: this.t1_time_series.legend,
        },
        xAxis: {
          type: 'category',
          data: this.t1_time_series.xAxis,
        },
        yAxis: {
          type: 'value',
        },
        series: this.t1_time_series.series,
      }
      var chartDom = document.getElementById('showtimeseries1')
      var myChart = echarts.init(chartDom)
      option && myChart.setOption(option)
    },
    showtimeseries2() {
      var option = {
        legend: {
          data: this.t2_time_series.legend,
        },
        xAxis: {
          type: 'category',
          data: this.t2_time_series.xAxis,
        },
        yAxis: {
          type: 'value',
        },
        series: this.t2_time_series.series,
      }
      var chartDom = document.getElementById('showtimeseries2')
      var myChart = echarts.init(chartDom)
      option && myChart.setOption(option)
    },
    showtimeseries3() {
      var option = {
        legend: {
          data: this.t3_time_series.legend,
        },
        xAxis: {
          type: 'category',
          data: this.t3_time_series.xAxis,
        },
        yAxis: {
          type: 'value',
        },
        series: this.t3_time_series.series,
      }
      var chartDom = document.getElementById('showtimeseries3')
      var myChart = echarts.init(chartDom)
      option && myChart.setOption(option)
    },
    showtimeseries4() {
      var option = {
        legend: {
          data: this.t4_time_series.legend,
        },
        xAxis: {
          type: 'category',
          data: this.t4_time_series.xAxis,
        },
        yAxis: {
          type: 'value',
        },
        series: this.t4_time_series.series,
      }
      var chartDom = document.getElementById('showtimeseries4')
      var myChart = echarts.init(chartDom)
      option && myChart.setOption(option)
    },
  },

  mounted() {
    this.initialize()
  },

  created() {},
}
</script>
