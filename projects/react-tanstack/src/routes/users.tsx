import {createFileRoute} from '@tanstack/react-router'
import {UserList} from '../User'

export const Route = createFileRoute('/users')({
  component: UserList,
})
