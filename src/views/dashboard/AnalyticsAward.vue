<script setup>
import triangleDark from '@images/misc/triangle-dark.png'
import triangleLight from '@images/misc/triangle-light.png'
import trophy from '@images/misc/trophy.png'
import { useTheme } from 'vuetify'

const { global } = useTheme()
const triangleBg = computed(() => (global.name.value === 'light' ? triangleLight : triangleDark))
</script>

<template>
  <VCard
    title="管理员， 欢迎! 🎉"
    subtitle="达芬奇手术器械管理系统"
    class="position-relative"
  >
    <VCardText>
      <h5 class="text-2xl font-weight-medium text-primary">系统文档已更新</h5>
      <p>覆盖100%功能 🚀</p>
      <VBtn size="small"> 查看文档 </VBtn>
    </VCardText>

    <!-- Triangle Background -->
    <VImg
      :src="triangleBg"
      class="triangle-bg flip-in-rtl"
    />

    <!-- Trophy -->
    <VImg
      :src="trophy"
      class="trophy"
    />
  </VCard>
</template>

<style lang="scss">
@use '@layouts/styles/mixins' as layoutsMixins;

.v-card .triangle-bg {
  position: absolute;
  inline-size: 10.375rem;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.v-card .trophy {
  position: absolute;
  inline-size: 4.9375rem;
  inset-block-end: 2rem;
  inset-inline-end: 2rem;
}
</style>
