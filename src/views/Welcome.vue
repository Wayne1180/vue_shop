<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="本轮接通率" name="cumulate">
        <!-- 折线图 -->
        <div id="line_show" style="width: 600px; height: 400px"></div>
      </el-tab-pane>
      <el-tab-pane label="累计接通率" name="round">
        <!-- 折线图 -->
        <div id="line_show2" style="width: 600px; height: 400px"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 导入echarts
import * as echarts from "echarts";
export default {
  data() {
    return {
      // 上来默认选中“本轮接通率”
      activeName: "cumulate",
      // 所有数据
      defaultProps: {
        _id: "636ba3d696f2927cf2eed548",
        task_id: "84bb3c18-c84b-44af-ab69-0c95cd0439d2",
        created_at: "2022-11-09 21:25:01",
        cumulate_data: [
          {
            answered: 9,
            noAnswer: 15,
          },
          {
            answered: 9,
            noAnswer: 14,
          },
          {
            answered: 9,
            noAnswer: 11,
          },
          {
            answered: 9,
            noAnswer: 10,
          },
        ],
        round_data: [
          {
            answered: 9,
            noAnswer: 15,
          },
          {
            answered: 1,
            noAnswer: 5,
          },
          {
            answered: 3,
            noAnswer: 2,
          },
          {
            answered: 1,
            noAnswer: 1,
          },
        ],
      },
    };
  },
  mounted() {
    this.setLineChartFn();
  },
  watch: {
    activeName(newValue, oldValue) {
      this.setLineChartFn();
    },
  },
  methods: {
    // 设置折线图
    setLineChartFn() {
      let currentData =
        this.activeName === "cumulate"
          ? this.defaultProps.cumulate_data
          : this.defaultProps.round_data;
      // 把X、Y轴数据重置
      let XData = [];
      let YData = [];
      // 设置X轴数据
      currentData.forEach((item, index) => {
        XData.push(`第${index + 1}次`);
      });
      // 设置Y轴数据
      currentData.forEach((item) => {
        let Item = Math.round(
          (item.answered / (item.answered + item.noAnswer)) * 100
        );
        YData.push(Item);
      });

      let chartDom =
        this.activeName === "cumulate"
          ? document.getElementById("line_show")
          : document.getElementById("line_show2");
      let myChart = echarts.init(chartDom);
      let option = {
        xAxis: {
          type: "category",
          data: XData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: YData,
            type: "line",
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style>
</style>