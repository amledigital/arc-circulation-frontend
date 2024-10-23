import { createFileRoute } from '@tanstack/react-router'
import {Main} from "../components/main"

export const Route = createFileRoute('/main')({
    loader: () => ("Hello"),
  component: Main
  })
