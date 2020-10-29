import {render, h} from 'vue'
const button = {
  name: 'btn-component',
  props: {
    text: String,
  },
  render() {
    console.log('props', this.text)
    return h(
      'button',
      {
        id: 'btn-primary',
      },
      this.text || 'Hello World',
    )
  },
}
export default button
