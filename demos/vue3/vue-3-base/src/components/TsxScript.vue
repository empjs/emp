<script lang="tsx">
import {defineComponent, ref} from 'vue';

export default defineComponent({
  name: 'TsxScript',
  // https://vuejs.org//guide/typescript/composition-api.html#without-script-setup
  props: {
    attr1: String,
    attr2: Boolean
  },
  setup(props) {
    const count = ref(0)
    function add() {
      count.value++
    }
    console.log(props)

    return () => (
      <>
        <p>============ lang=tsx component start =============</p>
        <AButton type="primary" onClick={add}>add</AButton>
        <span class="value">count: {count.value}</span>
        <p>
          props: {JSON.stringify(props)}
        </p>
        <p>============ lang=tsx component end =============</p>
      </>
    )
  }
})
</script>

<style lang="less" scoped>
.value {
  margin-left: 10px;
}
</style>