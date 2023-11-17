<template>
  <VCard>
    <VCardText>
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        :height="105"
      />

      <p class="text-center font-weight-medium mb-0">器械异常情况</p>
      <v-btn
        size="small"
        style="margin-top: 5px; margin-left: 38%"
        @click="addRoutes"
      >
        查看详情
      </v-btn>
    </VCardText>
  </VCard>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

export default {
  components: {
    VueApexCharts,
  },
  data: () => ({
    chartOptions: {},
    series: [
      {
        name: '2020',
        data: [45, 85, 65, 50, 70],
      },
    ],
  }),
  created() {
    this.initialize()
  },
  methods: {
    addRoutes() {
      this.$router.push('/data-dashboard')
    },
    initialize() {
      const vuetifyTheme = useTheme()
      const currentTheme = controlledComputed(
        () => vuetifyTheme.name.value,
        () => vuetifyTheme.current.value.colors,
      )

      this.chartOptions = controlledComputed(
        () => vuetifyTheme.name.value,
        () => {
          const backgroundColor = currentTheme.value.background

          return {
            chart: {
              type: 'bar',
              stacked: false,
              parentHeightOffset: 0,
              toolbar: { show: false },
            },
            grid: {
              show: false,
              padding: {
                top: -10,
                left: -7,
                right: 0,
                bottom: 5,
              },
            },
            colors: [
              currentTheme.value.error,
              currentTheme.value.primary,
              currentTheme.value.error,
              currentTheme.value.primary,
              currentTheme.value.primary,
            ],
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '20%',
                borderRadius: 4,
                startingShape: 'rounded',
                endingShape: 'rounded',
                distributed: true,
                colors: {
                  backgroundBarColors: [
                    backgroundColor,
                    backgroundColor,
                    backgroundColor,
                    backgroundColor,
                    backgroundColor,
                  ],
                  backgroundBarRadius: 5,
                },
              },
            },
            legend: { show: false },
            dataLabels: { enabled: false },
            xaxis: {
              labels: { show: false },
              axisBorder: { show: false },
              axisTicks: { show: false },
            },
            yaxis: { show: false },
            tooltip: { enabled: false },
          }
        },
      )
    },
  },
}
</script>
