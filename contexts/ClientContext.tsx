'use client'

import { createContext, useContext } from 'react'
import type { GHLClient } from '@/lib/types'

const ClientContext = createContext<GHLClient | null>(null)

export function ClientProvider({ client, children }: { client: GHLClient; children: React.ReactNode }) {
  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
}

export function useClient(): GHLClient {
  const ctx = useContext(ClientContext)
  if (!ctx) throw new Error('useClient must be used inside ClientProvider')
  return ctx
}
