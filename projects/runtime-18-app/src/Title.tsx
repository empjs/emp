export const Title = (props: any = {}) => {
  return (
    <div>
      <h1>{props.title || 'React 18 Runtime App'}</h1>
      <p>Runtime App!!</p>
    </div>
  )
}
export default Title
