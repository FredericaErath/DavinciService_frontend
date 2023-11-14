<template>
  <v-card
    class="mx-auto"
    max-width="1200"
  >
    <v-toolbar color="cyan-lighten-1">
      <v-toolbar-title>Message Box</v-toolbar-title>

      <v-spacer></v-spacer>
      <el-select
        v-model="status"
        multiple
        placeholder="Status"
        style="
          width: 200px;
          border-color: #000000b8 !important;
          margin-left: 5px;
          background-color: transparent !important;
        "
      >
        <el-option
          v-for="item in status_items"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="priority"
        multiple
        placeholder="Priority"
        style="
          width: 200px;
          border-color: #000000b8 !important;
          margin-left: 5px;
          background-color: transparent !important;
        "
      >
        <el-option
          v-for="item in priority_items"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="date_range"
        type="datetimerange"
        range-separator="TO"
        start-placeholder="Begin"
        end-placeholder="End"
        class="date_picker"
      >
      </el-date-picker>
      <v-btn
        variant="text"
        icon="mdi-magnify"
        @click="searchMessage"
      ></v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="items"
      item-value="m_id"
      select-strategy="single"
      show-select
      style="margin-bottom: 10px; margin-left: -10px"
    >
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-dots-horizontal"
              color="white"
              v-bind="props"
            ></v-btn>
          </template>
          <v-list width="125">
            <v-btn
              width="110"
              style="margin-left: 8px"
              @click="reviseItem(item.raw)"
              >REVISE</v-btn
            >
            <v-btn
              width="110"
              style="margin-top: 5px; margin-left: 8px"
              @click="show_delete = true"
              >DELETE</v-btn
            >
            <v-btn
              width="110"
              style="margin-top: 5px; margin-left: 8px"
              >MAKE A COPY</v-btn
            >
          </v-list>
        </v-menu>
        <v-dialog
          v-model="show_delete"
          max-width="600px"
          ><v-card class="text-center">
            <v-card-title class="text-h5 mb-6">
              <v-icon
                class="mb-5"
                color="error"
                icon="mdi-alert-circle"
                size="80"
              >
              </v-icon>
              <p>确定删除选中消息吗？</p>
              <p class="mb-4 text-medium-emphasis text-body-2">删除后可能将无法恢复</p>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="closeDelete"
                ><v-icon>mdi-cancel</v-icon>取消</v-btn
              >
              <v-btn
                color="purple"
                variant="text"
                @click="deleteItem(item.raw)"
                ><v-icon>mdi-download</v-icon>确定</v-btn
              >
            </v-card-actions>
          </v-card></v-dialog
        >
        <v-dialog
          v-model="show_revise"
          max-width="600px"
        >
          <v-card width="350">
            <v-card-title> 修改消息 </v-card-title>
            <v-sheet
              width="300"
              class="mx-auto"
              style="margin-top: 10px; margin-bottom: 10px; margin-left: 10px"
            >
              <v-form
                fast-fail
                @submit.prevent
              >
                <v-select
                  v-model="revise_status"
                  label="Status"
                  :items="status_items"
                ></v-select>

                <v-select
                  v-model="revise_priority"
                  :items="priority_items"
                  label="Priority"
                  style="margin-top: 10px"
                ></v-select>
                <v-text-field
                  v-model="feedback"
                  label="Feedback"
                  style="margin-top: 10px"
                ></v-text-field>

                <v-btn
                  type="submit"
                  block
                  @click="reviseSubmit(item.raw)"
                  class="mt-2"
                  >提交修改</v-btn
                >
              </v-form>
            </v-sheet>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { delete_message, get_message, update_message } from '@/axios/api'
import { ElNotification } from 'element-plus'
export default {
  data: () => ({
    show_revise: false,
    show_delete: false,
    feedback: null,
    revise_priority: null,
    revise_status: null,
    headers: [
      {
        align: 'start',
        key: 'name',
      },
      { title: 'Task', align: 'end', key: 'm_id' },
      { title: 'User_Name', align: 'end', key: 'u_name' },
      { title: 'Content', align: 'end', key: 'content' },
      { title: 'Feedback', align: 'end', key: 'feedback' },
      { title: 'Time', align: 'end', key: 'insert_time' },
      { title: 'Status', align: 'end', key: 'status' },
      { title: 'Priority', align: 'end', key: 'priority' },
      { title: '操作', key: 'actions', sortable: false },
    ],
    status: [],
    priority: [],
    date_range: [],
    priority_items: ['默认', '普通', '紧急'],
    status_items: ['未处理', '处理中', '已处理'],
    items: [],
    options: [{ title: 'Revise' }, { title: 'Delete' }, { title: 'Make a copy' }],
  }),
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      get_message({}).then(res => {
        this.items = res.data
      })
    },
    searchMessage() {
      var tmp_status = null
      var tmp_priority = null
      var tmp_begin_time = null
      var tmp_end_time = null
      if (this.status.length != 0) {
        tmp_status = this.status
      }
      if (this.priority.length != 0) {
        tmp_priority = this.priority
      }
      if (this.date_range.length != 0) {
        tmp_begin_time = this.date_range[0]
        tmp_end_time = this.date_range[1]
      }
      get_message({
        status: tmp_status,
        priority: tmp_priority,
        begin_time: tmp_begin_time,
        end_time: tmp_end_time,
      }).then(res => {
        this.items = res.data
      })
    },
    reviseItem(index) {
      this.show_revise = true
      this.revise_status = index.status
      this.revise_priority = index.priority
    },
    deleteItem(item) {
      delete_message({ m_id: item.m_id }).then(res => {
        if (res.status == 200) {
          ElNotification({
            title: 'Success',
            message: '删除成功！',
            type: 'success',
          })
          this.initialize()
        } else {
          ElNotification({
            title: 'Error',
            message: '删除失败，检查数据或联系管理员',
            type: 'Error',
          })
        }
      })
    },
    closeDelete() {
      this.show_delete = false
    },
    reviseSubmit(item) {
      update_message({
        m_id: item.m_id,
        status: this.revise_status,
        priority: this.revise_priority,
        feedback: this.feedback,
      }).then(res => {
        if (res.status == 200) {
          ElNotification({
            title: 'Success',
            message: '修改成功！',
            type: 'success',
          })
          this.initialize()
        } else {
          ElNotification({
            title: 'Error',
            message: '修改失败，检查数据或联系管理员',
            type: 'Error',
          })
        }
      })
      this.show_revise = false
    },
  },
}
</script>
<style>
.date_picker {
  border-color: #000000b8 !important;
  color: #232223b8;
  inline-size: 200px;
  margin-inline-start: 10px;
  max-inline-size: 300px;
}
</style>
