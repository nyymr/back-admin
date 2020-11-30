<template>
  <div class="dashboard-container">
    <div>
      <div>
        <i class="el-icon-s-custom"></i>
        <div>
          <p>总用户</p>
          <p>2,943</p>
        </div>
      </div>
      <div>
        <i class="el-icon-reading"></i>
        <div>
          <p>总文章</p>
          <p>212</p>
        </div>
      </div>
      <div>
        <i class="el-icon-question"></i>
        <div>
          <p>总提问</p>
          <p>4,151</p>
        </div>
      </div>
    </div>
    <div>
      <el-card class="box-card">
        <div style="height: 300px; width: 100%">
          <EchartsPie :option="option1"></EchartsPie>
        </div>
      </el-card>
      <el-card class="box-card">
        <div style="height: 300px; width: 100%">
          <EchartsBar :option="option2"></EchartsBar>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EchartsPie from "../../components/EchartsPie";
import EchartsBar from "../../components/EchartsBar";
export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  components: {
    EchartsPie,
    EchartsBar,
  },
  data() {
    return {
      option1: {
        title: {
          text: "某站点用户访问来源",
          subtext: "纯属虚构",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      option2: {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220],
          },
        ],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px 40px;
  .box-card {
    width: 48%;
  }
  > div {
    &:nth-child(1) {
      width: 100%;
      padding: 20px 0;
      margin: 20px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > div {
        width: 31%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0px 0px 10px 0px gainsboro;
        height: 100px;
        padding: 0 20px;
        box-sizing: border-box;
        >div{
          p{
            font-weight: 700;
            margin: 0;
            &:nth-child(1){
              font-size: 16px;
              color: #8C8CA2;
            }
            &:nth-child(2){
              font-size: 20px;
              margin-top: 8px;
            }
          }
        }
        >i{
          font-size: 60px;
          border-radius: 8px;
          padding: 10px;
        }
        &:nth-child(1){
          i{
            color: #4ECDCA;
          }
        }
        &:nth-child(1):hover{
          i{
            color: #fff;
            background-color: #4ECDCA;
          }
        }
        &:nth-child(2){
          i{
            color: #79C2FA;
          }
        }
        &:nth-child(2):hover{
          i{
            color: #fff;
            background-color: #79C2FA;
          }
        }
        &:nth-child(3){
          i{
            color: #F88B9D;
          }
        }
        &:nth-child(3):hover{
          i{
            color: #fff;
            background-color: #F88B9D;
          }
        }
      }
    }
    &:nth-child(2) {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
