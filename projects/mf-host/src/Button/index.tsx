import css from './Button.module.css'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  customLabel: string
}

export const Button = ({customLabel, ...rest}: ButtonProps) => (
  <button className={css.primary} {...rest}>
    {customLabel}
  </button>
)
