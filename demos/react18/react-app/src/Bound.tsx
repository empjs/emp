import css from './Bound.module.scss'
const Bound = ({children, name}: any) => (
  <div className={css.main}>
    <span className={css.name}>{name}</span>
    {children}
  </div>
)
export default Bound
