<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <VForm>
          <VCardText>
            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 new password -->
                <VTextField
                  v-model="newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="New Password"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Confirm New Password"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">Password Requirements:</p>

            <ul class="d-flex flex-column gap-y-3">
              <li
                v-for="item in passwordRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon
                    size="7"
                    icon="mdi-circle"
                    class="me-3"
                  />
                </div>
                <span class="font-weight-medium">{{ item }}</span>
              </li>
            </ul>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn @click="onSubmit">Save changes</VBtn>
            <Vcode
              :show="isShow"
              @success="onSuccess"
              @close="onClose"
            />
            <VBtn
              type="reset"
              color="secondary"
              variant="tonal"
            >
              Reset
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>
<script setup>
import { revise_user } from '@/axios/api'
import storage from '@/store/storage'
import { ElNotification } from 'element-plus'
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const isShow = ref(false)

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]
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
const onSubmit = () => {
  if (newPassword.value != confirmPassword.value) {
    confirmPassword.value = ''
    ElNotification({
      title: 'Error',
      message: '修改失败！密码不一致',
      type: 'error',
    })
  } else {
    revise_user({ u_id: storage.get('userId'), pwd: newPassword.value }).then(res => {
      isShow.value = true
      ElNotification({
        title: 'Success',
        message: '密码修改成功',
        type: 'success',
      })
    })
  }
}
</script>
