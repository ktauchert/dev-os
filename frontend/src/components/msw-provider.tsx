import { useEffect, useState } from 'react'

import { enableMocking, shouldUseMockApi } from '#/mocks/enable-mocking'

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!shouldUseMockApi())

  useEffect(() => {
    if (!shouldUseMockApi()) {
      setReady(true)
      return
    }
    void enableMocking().then(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Starting mock API…
      </div>
    )
  }

  return children
}
