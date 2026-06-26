import {createFileRoute} from '@tanstack/react-router'
import {RouterLabUser} from 'src/components/router-lab'

export const Route = createFileRoute('/router-lab/$id')({
  component: RouterLabUserRoute,
})

function RouterLabUserRoute() {
  const {id} = Route.useParams()
  return <RouterLabUser id={id} />
}
