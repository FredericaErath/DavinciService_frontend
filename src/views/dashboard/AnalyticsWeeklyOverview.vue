<template>
  <VCard>
    <VCardItem>
      <VCardTitle>详细数据</VCardTitle>
    </VCardItem>

    <VCardText>
      <VueApexCharts
        type="bar"
        :options="options"
        :series="series"
        :height="220"
      />

      <div class="d-flex align-center mb-3">
        <p>从数据看板中能够了解详细数据 😎</p>
      </div>

      <VBtn
        block
        @click="addRoutes"
      >
        查看
      </VBtn>
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
    options: {},
    series: [
      {
        data: [207, 101, 145, 175, 187, 140, 165],
      },
    ],
  }),
  created() {
    this.getOptions()
  },
  methods: {
    addRoutes() {
      this.$router.push('/data-dashboard')
    },
    getOptions() {
      const vuetifyTheme = useTheme()
      this.options = controlledComputed(
        () => vuetifyTheme.name.value,
        () => {
          const currentTheme = ref(vuetifyTheme.current.value.colors)

          return {
            chart: {
              parentHeightOffset: 0,
              toolbar: { show: false },
            },
            plotOptions: {
              bar: {
                borderRadius: 9,
                distributed: true,
                columnWidth: '40%',
                endingShape: 'rounded',
                startingShape: 'rounded',
              },
            },
            stroke: {
              width: 2,
              colors: [currentTheme.value.surface],
            },
            legend: { show: false },
            grid: {
              show: false,
            },
            dataLabels: { enabled: false },
            colors: [
              currentTheme.value['grey-100'],
              currentTheme.value['grey-100'],
              currentTheme.value['grey-100'],
              currentTheme.value.primary,
              currentTheme.value['grey-100'],
              currentTheme.value['grey-100'],
            ],
            states: {
              show: false,
            },
            xaxis: {
              categories: ['1', '2', '3', '4', '5', '6', '7'],
              tickPlacement: 'off',
              labels: { show: false },
              crosshairs: { opacity: 0 },
              axisTicks: { show: false },
              axisBorder: { show: false },
            },
            yaxis: {
              show: false,
              tickAmount: 4,
              labels: {
                show: false,
              },
            },
          }
        },
      )
    },
  },
}
</script>
