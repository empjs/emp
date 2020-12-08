import Button from './Button.vue'

Button.install = app => {
  app.component(Button.name, Button)
}

export default Button
