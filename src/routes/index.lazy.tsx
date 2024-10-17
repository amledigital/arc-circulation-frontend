import { createLazyFileRoute } from '@tanstack/react-router'
import { Home } from '../components/home'

export const Route = createLazyFileRoute('/')({
  component: () => <Home />
})