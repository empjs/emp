<template>
<div>
  <div class="v2box">{{ title }}</div>
  <div class="v2box">Prop: {{ dataProps }}</div>
</div>
</template>

<script>
export default {
  data() {
    return {
      title: "EMP Vue2 Component From BASE",
    };
  },
  props: {
    dataProps: { type: Number, required: false },
    methodProps: { type: Function, required: false },
  },
  mounted: function () {
    this.methodProps && this.methodProps();
    console.log(this.$props)
    console.log(this.$attrs)
    console.log(this.$listeners)
    this.$listeners['my-event']()
  },
};
</script>

<style>
.v2box {
  font-size: 38px;
  color: green;
  font-weight: bold;
}
</style>
