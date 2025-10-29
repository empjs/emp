import type {ReactNode} from 'react'
import 'src/tailwindcss/scope.css'
export const TailwindWrap = ({children}: {children: ReactNode}) => (
  <div className="tailwindcss-host-contaner">{children}</div>
)
