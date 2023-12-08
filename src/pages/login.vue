<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> Materio </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">欢迎来到达芬奇器械管理后台! 👋🏻</h5>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="用户名"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="密码"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="form.remember"
                  label="记住我"
                />

                <a
                  class="ms-2 mb-1"
                  href="javascript:void(0)"
                >
                  忘记密码?
                </a>
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
                @click="onSubmit"
              >
                登录
              </VBtn>
              <Vcode
                :show="isShow"
                @success="onSuccess"
                @close="onClose"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<script>
import { login_api } from '@/axios/api'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { ElNotification } from 'element-plus'
import Vcode from 'vue3-puzzle-vcode'
import { useTheme } from 'vuetify'
export default {
  components: { Vcode },
  data: () => ({
    isShow: false,
    authThemeMask: '',
    isPasswordVisible: false,
    form: { email: '', password: '', remember: false },
  }),
  created() {
    this.getMask()
    ElNotification({
      title: 'Login',
      message: '检测到您未登录，请先登录！',
      type: 'info',
    })
  },
  methods: {
    onClose() {
      this.isShow = false
    },
    onSuccess() {
      this.onClose()
      ElNotification({
        title: 'Success',
        message: '登录成功！',
        type: 'success',
      })
      this.$router.push('/dashboard')
    },
    onSubmit() {
      login_api({ u_id: this.form.email, pwd: this.form.password, user_type: '管理员' })
        .then(res => {
          this.$store.commit('setToken', res.data.token)
          this.$store.commit('setUserName', res.data.name)
          this.$store.commit('setUserId', res.data.u_id)
          this.isShow = true
        })
        .catch(err => {
          ElNotification({
            title: 'Error',
            message: '登录失败，用户名或密码错误',
            type: 'Error',
          })
        })
    },
    getMask() {
      var vuetifyTheme = useTheme()
      this.authThemeMask = computed(() => {
        return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
      })
    },
  },
}
</script>


<style lang="scss">
@use '@core/scss/pages/page-auth.scss';
</style>
