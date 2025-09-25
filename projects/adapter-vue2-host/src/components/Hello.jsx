export default {
  props: {
    name: {
      type: String,
      default: 'appName',
    },
  },
  methods: {
    handleButtonClick(e) {
      e.preventDefault()
      alert('button clicked')
    },
  },
  render() {
    return (
      <div>
        <Hello name={this.name} />
        <button onClick={this.handleButtonClick}> click me</button>
      </div>
    )
  },
}

export const Hello = ({name}) => <h2>hello jsx Component Here! {name}</h2>
