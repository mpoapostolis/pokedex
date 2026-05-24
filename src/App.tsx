import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router'
import { Layout } from './components/chrome/Layout'
import { LoadingState } from './components/ui/LoadingState'
import { ErrorState } from './components/ui/ErrorState'
import { TooltipProvider } from './components/ui/Tooltip'
import NotFoundPage from './pages/NotFoundPage'

const DiscoveryPage = lazy(() => import('./pages/DiscoveryPage'))
const PokemonDetailPage = lazy(() => import('./pages/PokemonDetailPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingState />}>{children}</Suspense>
}

function RouteError() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <ErrorState onRetry={() => window.location.reload()}>{message}</ErrorState>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Lazy><DiscoveryPage /></Lazy> },
      { path: 'pokemon/:name', element: <Lazy><PokemonDetailPage /></Lazy> },
      { path: 'team', element: <Lazy><TeamPage /></Lazy> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return (
    <TooltipProvider delayDuration={250}>
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}
