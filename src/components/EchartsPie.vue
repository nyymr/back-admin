<template>
  <div id="pie"></div>
</template>
<script>
import echarts from "echarts";
export default {
  props: {
    option: Object,
    required: true,
  },
  mounted() {
    console.log(this.option);
    let myChart = echarts.init(document.getElementById("pie"));
    myChart.setOption(this.option);
  },
};
</script>
<style scoped>
  #pie{
    width: 100%;
    height: 100%;
  }
</style>
