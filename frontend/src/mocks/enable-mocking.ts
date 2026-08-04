/** Start MSW in the browser (dev / preview with mock API). */
export async function enableMocking() {
  if (import.meta.env.PROD && import.meta.env.VITE_MOCK_API !== 'true') {
    return
  }
  if (import.meta.env.VITE_MOCK_API === 'false') {
    return
  }

  const { worker } = await import('#/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: import.meta.env.MODE === 'test',
  })
}

export function shouldUseMockApi(): boolean {
  if (import.meta.env.VITE_MOCK_API === 'false') return false
  if (import.meta.env.VITE_MOCK_API === 'true') return true
  return import.meta.env.DEV || import.meta.env.MODE === 'test'
}
