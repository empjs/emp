import {createFileRoute} from '@tanstack/react-router'
import Info from '../Info'

export const Route = createFileRoute('/info')({
  component: Info,
})
