<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="5"
    >
      <AnalyticsAward />
    </VCol>

    <VCol
      cols="12"
      md="7"
    >
      <AnalyticsTransactions :general_data="general_data"> </AnalyticsTransactions>
    </VCol>

    <VCol
      cols="12"
      md="5"
    >
      <AnalyticsWeeklyOverview />
    </VCol>

    <VCol
      cols="12"
      md="7"
    >
      <VRow class="match-height">
        <VCol
          cols="12"
          sm="6"
        >
          <AnalyticsTotalProfitLineCharts :cost="cost_data" />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <CardStatisticsVertical v-bind="totalProfit" />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <CardStatisticsVertical v-bind="newProject" />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <AnalyticsBarCharts />
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
<script>
import { get_general_data } from '@/axios/api'
import AnalyticsAward from '@/views/dashboard/AnalyticsAward.vue'
import AnalyticsBarCharts from '@/views/dashboard/AnalyticsBarCharts.vue'
import AnalyticsTotalProfitLineCharts from '@/views/dashboard/AnalyticsTotalProfitLineCharts.vue'
import AnalyticsTransactions from '@/views/dashboard/AnalyticsTransactions.vue'
import AnalyticsWeeklyOverview from '@/views/dashboard/AnalyticsWeeklyOverview.vue'
import CardStatisticsVertical from '@core/components/cards/CardStatisticsVertical.vue'

export default {
  components: {
    AnalyticsAward,
    AnalyticsBarCharts,
    AnalyticsTotalProfitLineCharts,
    AnalyticsTransactions,
    AnalyticsWeeklyOverview,
    CardStatisticsVertical,
  },
  data: () => ({
    general_data: {},
    cost_data: 0,
    totalProfit: {
      title: '系统维护成本',
      color: 'secondary',
      icon: 'mdi-poll',
      stats: '￥2k',
      change: 2,
      subtitle: '本月新增',
    },
    newProject: {
      title: '医生用户本月消息',
      color: 'primary',
      icon: 'mdi-briefcase-variant-outline',
      stats: '0',
      change: 0,
      subtitle: '新增未处理',
    },
  }),
  mounted() {
    this.initialize()
  },
  methods: {
    initialize() {
      get_general_data().then(res => {
        this.general_data = res.data
        this.newProject.stats = res.data.message
        this.newProject.change = res.data.unhandled_message
        this.cost_data = res.data.cost.toString()
      })
    },
  },
}
</script>
