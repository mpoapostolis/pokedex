import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import App from './App'
import { hydrateTeamFromUrl } from './store/teamStore'
import './index.css'

const WEEK = 1000 * 60 * 60 * 24 * 7

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: WEEK,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// PokeAPI's fair-use policy asks consumers to cache resources locally. The whole
// query cache is persisted to localStorage, so repeat visits cost zero network.
const persister = createSyncStoragePersister({ storage: window.localStorage })

// Seed the team store from any ?team= in the URL before the app renders.
// Background music is started from the title screen's "Press Start"
// click (see IntroScreen) — the gesture browsers require for audio.
hydrateTeamFromUrl()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: WEEK, buster: 'pokedex-v2' }}
    >
      <App />
    </PersistQueryClientProvider>
  </StrictMode>,
)
