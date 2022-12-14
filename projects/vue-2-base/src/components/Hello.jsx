export default {
  methods: {
    handleButtonClick(e) {
      e.preventDefault()
      alert('button clicked')
    },
  },
  render() {
    return (
      <div>
        <Hello />
        <button onClick={this.handleButtonClick}> click me</button>
      </div>
    )
  },
}

export const Hello = () => <h2>hello world</h2>
