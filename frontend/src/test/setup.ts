import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { resetProjectsDb } from '#/mocks/db/projects-db'
import { server } from '#/mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  resetProjectsDb()
})
afterAll(() => server.close())
