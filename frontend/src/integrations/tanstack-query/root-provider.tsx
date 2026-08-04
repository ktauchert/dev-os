import { QueryClient } from '@tanstack/react-query'

import { getQueryClient } from '#/lib/query-client'

export function getContext() {
  const queryClient = getQueryClient()

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {}
