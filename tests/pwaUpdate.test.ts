import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('a new service worker activates immediately after its shell is ready', async () => {
  const source = await readFile(new URL('../scripts/generate-service-worker.mjs', import.meta.url), 'utf8')
  const installHandler = source.slice(source.indexOf("self.addEventListener('install'"), source.indexOf("self.addEventListener('activate'"))

  assert.match(installHandler, /await fillCache\(SHELL_CACHE, SHELL_ASSETS\)/)
  assert.match(installHandler, /await self\.skipWaiting\(\)/)
})

test('an already controlled page reloads once when the updated worker takes control', async () => {
  const source = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8')

  assert.match(source, /const hadController = Boolean\(navigator\.serviceWorker\.controller\)/)
  assert.match(source, /addEventListener\('controllerchange'/)
  assert.match(source, /window\.location\.reload\(\)/)
  assert.match(source, /registration\.update\(\)/)
  assert.match(source, /\{ once: true \}/)
})
