<template>
  <v-data-table
    v-model="selected"
    hide-default-footer
    :headers="headers"
    :items-per-page="10"
    :items="users"
    :sort-by="[{ key: '用户名称', order: 'asc' }]"
    :search="search"
    show-select
    class="elevation-1"
  >
    <template v-slot:item.user_type="{ item }">
      <v-chip :color="getColor(item.columns.user_type)">
        {{ item.columns.user_type }}
      </v-chip>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>用户管理</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Search"
          single-line
          rounded
          hide-details
          style="margin-top: 5px; margin-bottom: 5px"
        ></v-text-field>

        <!--add user-->
        <v-dialog
          v-model="dialog"
          max-width="700px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="props"
              @click="addUser"
            >
              <v-icon>mdi-plus</v-icon>添加用户
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.u_id"
                      label="账号"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.name"
                      label="用户名称"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      label="用户类型"
                      v-model="editedItem.user_type"
                      :disabled="flag"
                      :items="['管理员', '医生', '护士']"
                    ></v-select>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.code"
                      label="密码"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                <v-icon>mdi-cancel</v-icon>取消
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                <v-icon>mdi-download</v-icon>保存
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--delete users-->
        <v-dialog
          v-model="dialogDelete1"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="props"
            >
              <v-icon>mdi-delete</v-icon>删除用户
            </v-btn>
          </template>
          <v-card class="text-center">
            <v-card-title class="text-h5 mb-6">
              <v-icon
                class="mb-5"
                color="error"
                icon="mdi-alert-circle"
                size="80"
              >
              </v-icon>
              <p>确定删除选中用户吗？</p>
              <p class="mb-4 text-medium-emphasis text-body-2">删除后可能将无法恢复</p>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="closeDelete1"
                ><v-icon>mdi-cancel</v-icon>取消</v-btn
              >
              <v-btn
                color="purple"
                variant="text"
                @click="deleteItemConfirm1"
                ><v-icon>mdi-download</v-icon>确定</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--add users-->
        <v-dialog
          v-model="importFile"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="props"
            >
              <v-icon>mdi-file-import-outline</v-icon>批量导入用户
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-alert
                v-model="alert"
                border="start"
                variant="tonal"
                closable
                close-label="Close Alert"
                color="purple"
              >
                注意，批量导入时列名必须为：u_id（账号），name（用户名称）user_type（用户类型）code（密码）
              </v-alert>
            </v-card-text>
            <v-card-text>
              <v-spacer></v-spacer>
              <v-file-input
                chips
                type="file"
                v-model="file"
                accept=".xlsx,.csv"
                label="导入xlsx或csv文件"
              ></v-file-input>
            </v-card-text>
            <v-card-actions>
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
                ><v-icon>mdi-download</v-icon>确定</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
        size="small"
        class="me-2"
        @click="editItem(item.raw)"
      >
        mdi-pencil
      </v-icon>
    </template>
  </v-data-table>
</template>
<script>
import { add_one_user, delete_user, get_users_api, revise_user, upload_users } from '@/axios/api'
import { ElNotification } from 'element-plus'
export default {
  data: () => ({
    dialog: false,
    importFile: false,
    dialogDelete1: false,
    itemsPerPage: 10,
    alert: true,
    isDisabled: true, // 或者 false
    flag: false,
    file: '',
    search: '',
    selected: [],
    headers: [
      {
        title: '账号',
        align: 'start',
        sortable: false,
        key: 'u_id',
      },
      { title: '用户名称', key: 'name' },
      { title: '用户类型', key: 'user_type' },
      { title: '创建时间', key: 'insert_datetime' },
      { title: '操作', key: 'actions', sortable: false },
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      u_id: '',
      name: '',
      user_type: '护士',
      code: '000000',
      protein: 0,
    },
    tempItem: {},
    defaultItem: {
      u_id: '',
      name: '',
      user_type: '护士',
      code: '000000',
      protein: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新用户' : '修改用户'
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
      get_users_api({ user: {} }).then(res => {
        this.users = res.data
      })
    },
    getColor(user_type) {
      if (user_type == '护士') {
        return '#626aef'
      } else if (user_type == '医生') {
        return 'success'
      } else {
        return '#e6a23c'
      }
    },
    addUser() {
      this.flag = false
    },

    importConfirm() {
      var form = new FormData()
      form.append('file', this.file[0])
      upload_users(form).then(res => {
        if (res.status == 200) {
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

    editItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.flag = true
    },

    deleteItemConfirm1() {
      var u_ids = []
      this.selected.forEach(element => {
        u_ids.push(element['u_id'])
      })
      delete_user(u_ids).then(res => {
        this.initialize()
      })
      this.closeDelete1()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete1() {
      this.selected = []
      this.dialogDelete1 = false
    },

    save() {
      if (this.flag == false) {
        add_one_user({
          u_id: this.editedItem.u_id,
          name: this.editedItem.name,
          user_type: this.editedItem.user_type,
          pwd: this.editedItem.code,
        }).then(res => {
          if (res.status == 200) {
            this.initialize()
            ElNotification({
              title: 'Success',
              message: '用户信息添加成功！',
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
        var temp = this.users[this.editedIndex]
        var post = {
          u_id: temp.u_id,
          name: this.editedItem.name,
          user_type: this.editedItem.user_type,
          pwd: this.editedItem.code,
        }
        if (temp.u_id != this.editedItem.u_id) {
          post['new_id'] = this.editedItem.u_id
        }
        revise_user(post).then(res => {
          if (res.status == 200) {
            ElNotification({
              title: 'Success',
              message: '用户信息更新成功！',
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
