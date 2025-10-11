import {createFileRoute} from '@tanstack/react-router'
import {Home} from 'src/components/home'

export const Route = createFileRoute('/')({
  component: Home,
})
