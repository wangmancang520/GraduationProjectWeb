import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const source = await readFile(new URL('../src/utils/session.js', import.meta.url), 'utf8')
const { readUser, roleHome } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
let stored = null
globalThis.localStorage = { getItem: () => stored, removeItem: () => { stored = null } }
test('corrupt and missing sessions do not crash navigation', () => {
  stored = '{invalid'
  assert.equal(readUser(), null)
  assert.equal(stored, null)
  stored = 'null'
  assert.equal(readUser(), null)
  stored = '{}'
  assert.equal(readUser(), null)
})
test('valid session and all original roles are supported', () => {
  stored = '{"token":"test","utype":3}'
  assert.equal(readUser().utype, 3)
  assert.equal(roleHome(1), '/user')
  assert.equal(roleHome(2), '/user')
  assert.equal(roleHome(3), '/classroom-admin')
  assert.equal(roleHome(4), '/manager')
  assert.equal(roleHome(99), '/login')
})
