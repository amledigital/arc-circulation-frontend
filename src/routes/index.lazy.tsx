import { createLazyFileRoute } from '@tanstack/react-router'
import { Home } from '../components/home'

export type HomeSearchParams = {
    sectionID?: string
    from?: number
    size?: number
}


export const Route = createLazyFileRoute('/')({
  component: () => <Home />,
      validateSearch: (search: Record<string,unknown>):HomeSearchParams => {
      return {
          sectionID: search.sectionID as string,
          from: search.from as number,
          size: search.size as number,
      }
  }
})
