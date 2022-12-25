<script lang="tsx">
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'TsxScript',
  setup() {
    const count = ref(0)
    function add() {
      count.value++
    }

    return () => (
      <>
        <p>============ lang=tsx component start =============</p>
        <AButton type="primary" onClick={add}>add</AButton>
        <span class="value">count: {count.value}</span>
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