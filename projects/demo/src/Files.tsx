import css from './App.module.scss'
const Files = () => {
  return (
    <ul className={css.imglist}>
      <li>
        <h3>JPG</h3>
        <img src="/logo.jpg" />
      </li>
      <li>
        <h3>src from require</h3>
        <img src={require('./assets/logo.jpg')} />
      </li>
      <li>
        <h3>background</h3>
        <div className={css.bg}>bg</div>
      </li>
      <li>
        <h3>Webp</h3>
        <img src="/1.webp" />
      </li>
      <li>
        <h3>PNG</h3>
        <img src="/2.png" />
      </li>
      <li>
        <h3>GIF</h3>
        <img src="/3.gif" />
      </li>
      <li>
        <h3>SVG</h3>
        <img src="/4.svg" />
      </li>
    </ul>
  )
}
export default Files
