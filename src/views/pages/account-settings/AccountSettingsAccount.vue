<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Account Details">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded="lg"
            size="100"
            class="me-6"
            :image="accountDataLocal.avatarImg"
          />
        </VCardText>

        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <v-text-field
                  v-model="userName"
                  label="User Name"
                  variant="outlined"
                ></v-text-field>
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="6"
                cols="12"
              >
                <v-text-field
                  v-model="userId"
                  label="Account"
                  variant="outlined"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.email"
                  label="User Type"
                  disabled="true"
                />
              </VCol>

              <!-- 👉 Organization -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.org"
                  label="Organization"
                  disabled="true"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VBtn @click="submitRevise">SAVE CHANGES</VBtn>
                <Vcode
                  :show="isShow"
                  @success="onSuccess"
                  @close="onClose"
                />
                <VBtn
                  style="margin-left: 30px"
                  @click="resetForm"
                  >Cancel</VBtn
                >
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
<script setup>
import { revise_user } from '@/axios/api'
import storage from '@/store/storage'
import avatar1 from '@images/avatars/avatar-1.png'
import { ElNotification } from 'element-plus'
import Vcode from 'vue3-puzzle-vcode'

const isShow = ref(false)
const userName = ref(storage.get('userName'))
const userId = ref(storage.get('userId'))
const accountData = {
  avatarImg: avatar1,
  email: '管理员',
  org: '苏北人民医院',
}

const accountDataLocal = ref(structuredClone(accountData))

const resetForm = () => {
  userName.value = storage.get('userName')
  userId.value = storage.get('userId')
}

const onClose = () => {
  isShow.value = false
}
const onSuccess = () => {
  onClose()
  location.reload()
  ElNotification({
    title: 'Success',
    message: '修改成功！',
    type: 'success',
  })
}

// reset avatar image
const submitRevise = () => {
  revise_user({ u_id: storage.get('userId'), name: userName.value, new_id: userId.value }).then(res => {
    isShow.value = true
    storage.set('userName', userName.value)
    storage.set('userId', userId.value)
  })
}
</script>
