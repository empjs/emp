import './lazyComponent.less'
import css from './lazyComponent.module.less'

const LazyComponent = () => (
  <>
    <div className="lazyComponent">
      <h2 className={css.lazyComponentTitle}>LazyComponent</h2>
      LazyComponent!
    </div>
  </>
)
export default LazyComponent
