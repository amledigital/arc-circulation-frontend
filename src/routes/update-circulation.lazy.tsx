import { Navigate,createLazyFileRoute } from '@tanstack/react-router'
import {GetUpdateCirculation} from "../components/getUpdateCirculation"

export const Route = createLazyFileRoute('/update-circulation')({
  component: () => <GetUpdateCirculation />,
})
