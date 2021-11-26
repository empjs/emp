<template>
  <div class="app">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="Alert" name="first">
        <Alert />
      </el-tab-pane>
      <el-tab-pane label="Step" name="second">
        <Step />
      </el-tab-pane>
      <el-tab-pane label="Table" name="third">
        <Table />
      </el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Alert from "./components/alert.vue";
import Step from "./components/step.vue";
import Table from "@base/Table";
export default {
  components: { Alert, Step, Table },
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style scoped lang="scss"></style>
