import {createFileRoute} from '@tanstack/react-router'
import User from '../User'

export const Route = createFileRoute('/user/$id')({
  component: ({params}: any) => <User id={String(params.id)} />,
})

