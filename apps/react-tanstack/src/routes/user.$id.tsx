import {createFileRoute} from '@tanstack/react-router'
import User from '../User'

export const Route = createFileRoute('/user/$id')({
  component: UserRouteComponent,
})

function UserRouteComponent() {
  const {id} = Route.useParams()
  return <User id={id} />
}
