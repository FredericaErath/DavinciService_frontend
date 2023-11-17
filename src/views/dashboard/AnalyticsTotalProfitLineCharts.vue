<template>
  <VCard>
    <VCardText>
      <h6 class="text-h6">￥{{ cost }}</h6>
      <VueApexCharts
        type="line"
        :options="chartOptions"
        :series="series"
        :height="100"
      />

      <p class="text-center font-weight-medium mb-0">本月器械成本</p>
    </VCardText>
  </VCard>
</template>

<script>
import { hexToRgb } from '@layouts/utils'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

export default {
  components: {
    VueApexCharts,
  },
  props: {
    cost: String,
    required: true,
  },
  data: () => ({
    chartOptions: {},
    series: [
      {
        data: [0, 20, 5, 30, 15, 45],
      },
    ],
  }),
  created() {
    this.get_chart()
  },

  methods: {
    get_chart() {
      const vuetifyTheme = useTheme()
      const currentTheme = controlledComputed(
        () => vuetifyTheme.name.value,
        () => vuetifyTheme.current.value.colors,
      )
      const variableTheme = controlledComputed(
        () => vuetifyTheme.name.value,
        () => vuetifyTheme.current.value.variables,
      )

      this.chartOptions = controlledComputed(
        () => vuetifyTheme.name.value,
        () => {
          return {
            chart: {
              parentHeightOffset: 0,
              toolbar: { show: false },
            },
            tooltip: { enabled: false },
            grid: {
              borderColor: `rgba(${hexToRgb(String(variableTheme.value['border-color']))},${
                variableTheme.value['border-opacity']
              })`,
              strokeDashArray: 6,
              xaxis: { lines: { show: true } },
              yaxis: { lines: { show: false } },
              padding: {
                top: -10,
                left: -7,
                right: 5,
                bottom: 5,
              },
            },
            stroke: {
              width: 3,
              lineCap: 'butt',
              curve: 'straight',
            },
            colors: [currentTheme.value.primary],
            markers: {
              size: 6,
              offsetY: 4,
              offsetX: -2,
              strokeWidth: 3,
              colors: ['transparent'],
              strokeColors: 'transparent',
              discrete: [
                {
                  size: 5.5,
                  seriesIndex: 0,
                  strokeColor: currentTheme.value.primary,
                  fillColor: currentTheme.value.surface,
                  dataPointIndex: this.series[0].data.length - 1,
                },
              ],
              hover: { size: 7 },
            },
            xaxis: {
              labels: { show: false },
              axisTicks: { show: false },
              axisBorder: { show: false },
            },
            yaxis: { labels: { show: false } },
          }
        },
      )
    },
  },
}
</script>
