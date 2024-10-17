import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/main')({
  component: () => <div>Hello /main!</div>,
})
