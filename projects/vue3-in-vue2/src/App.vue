<template>
  <div class="main">
    <h1>vue3 in vue2</h1>
    <div class="demo-section">
      <h2>Vue2 App.vue</h2>

      <!-- 使用适配器加载Vue3组件 -->
      <div class="adapter-demo">
        <h3>Vue3 Component:</h3>
        <Vue3Adapter module-name="v3h/Info" :component-props="vue3Props" />
      </div>

    </div>
  </div>
</template>

<script>
import Vue3Adapter from './Adapter'


export default {
  components: {
    Vue3Adapter,
  },
  data() {
    return {
      vue3Props: {
        title: '来自Vue2的数据',
        message: '这是通过适配器传递给Vue3组件的props'
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  h1 {
    font-size: 28px;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
  }

  .demo-section {
    margin-top: 30px;

    h2 {
      font-size: 24px;
      color: #34495e;
      margin-bottom: 20px;
    }

    h3 {
      font-size: 18px;
      color: #7f8c8d;
      margin-bottom: 15px;
    }

    .adapter-demo,
    .original-demo {
      margin-bottom: 40px;
      padding: 20px;
      border: 1px solid #ecf0f1;
      border-radius: 8px;
      background-color: #f8f9fa;

      h3 {
        margin-top: 0;
        color: #2980b9;
      }
    }

    .adapter-demo {
      border-left: 4px solid #27ae60;
    }

    .original-demo {
      border-left: 4px solid #e74c3c;

      button {
        padding: 8px 16px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;

        &:hover {
          background-color: #2980b9;
        }

        &:active {
          background-color: #21618c;
        }
      }
    }
  }
}
</style>
