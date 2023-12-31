<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import upgradeBannerDark from '@images/pro/upgrade-banner-dark.png'
import upgradeBannerLight from '@images/pro/upgrade-banner-light.png'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import { useTheme } from 'vuetify'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

const vuetifyTheme = useTheme()

const upgradeBanner = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? upgradeBannerLight : upgradeBannerDark
})
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="mdi-menu" />
        </IconBtn>

        <!-- 👉 Search -->
        <div
          class="d-flex align-center cursor-pointer"
          style="user-select: none"
        >
          <!-- 👉 Search Trigger button -->
        </div>

        <VSpacer />

        <IconBtn
          class="me-2"
          href="https://github.com/FredericaErath/DavinciService"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VIcon icon="mdi-github" />
        </IconBtn>

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: 'Home',
          icon: 'mdi-home-outline',
          to: '/dashboard',
        }"
      />

      <!-- 👉 User Interface -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'User Interface',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'User Management',
          icon: 'mdi-form-select',
          to: '/user-management',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Instrument Management',
          icon: 'mdi-form-select',
          to: '/instrument-management',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Surgery Data Board',
          icon: 'mdi-form-select',
          to: '/surgery-data-board',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Supply Management',
          icon: 'mdi-form-select',
          to: '/supply-management',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Data Dashboard',
          icon: 'mdi-form-select',
          to: '/data-dashboard',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Message Center',
          icon: 'mdi-form-select',
          to: '/message-center',
        }"
      />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
