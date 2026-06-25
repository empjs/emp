import {createFileRoute} from '@tanstack/react-router'
import DynamicPage from '../DynamicPage'

export const Route = createFileRoute('/dynamic')({
  component: DynamicPage,
})
