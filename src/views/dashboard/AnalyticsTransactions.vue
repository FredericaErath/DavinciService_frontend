<template>
  <VCard>
    <VCardItem>
      <VCardTitle>数据概览</VCardTitle>
    </VCardItem>

    <VCardText>
      <h6 class="text-sm font-weight-medium mb-12">
        <span>从这里了解系统总体数据 😎</span>
      </h6>

      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="6"
          sm="3"
        >
          <div class="d-flex align-center">
            <div class="me-3">
              <VAvatar
                :color="item.color"
                rounded
                size="42"
                class="elevation-1"
              >
                <VIcon
                  size="24"
                  :icon="item.icon"
                />
              </VAvatar>
            </div>

            <div class="d-flex flex-column">
              <span class="text-caption">
                {{ item.title }}
              </span>
              <span class="text-h6">{{ item.stats }}</span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
<script>
export default {
  props: {
    general_data: Object,
    required: true,
  },
  watch: {
    general_data: {
      handler(newValue, oldValue) {
        this.initialize()
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.initialize()
  },
  data: () => ({
    statistics: [],
  }),
  methods: {
    initialize() {
      this.statistics = [
        {
          title: '手术',
          stats: this.general_data.surgery,
          icon: 'mdi-trending-up',
          color: 'primary',
        },
        {
          title: '用户',
          stats: this.general_data.users,
          icon: 'mdi-account-outline',
          color: 'success',
        },
        {
          title: '器械',
          stats: this.general_data.instrument,
          icon: 'mdi-cellphone-link',
          color: 'warning',
        },
        {
          title: '耗材',
          stats: this.general_data.consumable,
          icon: 'mdi-currency-usd',
          color: 'info',
        },
      ]
    },
  },
}
</script>
