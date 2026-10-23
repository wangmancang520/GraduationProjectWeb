import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const source = await readFile(new URL('../src/utils/appointment.js', import.meta.url), 'utf8')
const { appointmentParams } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
test('picker wall clock is sent in the campus timezone', () => {
  const params = { date: '2030-02-03', startTime: new Date(2026, 10, 1, 9, 30, 0), endTime: '' }
  const result = appointmentParams(params)
  assert.equal(result.startTime, '2030-02-03T09:30:00+08:00')
  assert.equal(result.endTime, '')
  assert.ok(params.startTime instanceof Date)
})
test('Date-valued date pickers keep their selected calendar day', () => {
  assert.equal(appointmentParams({ date: new Date(2030, 1, 3), startTime: '' }).date, '2030-02-03')
})
