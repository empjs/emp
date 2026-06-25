import {Button} from 'ant-design-vue'
import {defineComponent, ref} from 'vue'
import styles from './index.module.less'

export default defineComponent({
  name: 'JSXComponent',
  setup() {
    const value = ref(0)
    function add() {
      value.value++
    }

    return () => (
      <div>
        <p>============ jsx component start =============</p>
        <Button onClick={add}>add</Button>
        <span class={styles.space}>value:{value.value}</span>
        <p>============ jsx component end =============</p>
      </div>
    )
  },
})
