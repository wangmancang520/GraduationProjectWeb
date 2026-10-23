const pad = value => String(value).padStart(2, '0')
export function appointmentParams(params) {
  const result = { ...params }
  const date = params.date instanceof Date
    ? `${params.date.getFullYear()}-${pad(params.date.getMonth() + 1)}-${pad(params.date.getDate())}`
    : params.date
  result.date = date
  for (const key of ['startTime', 'endTime']) {
    const value = params[key]
    if (value instanceof Date && !Number.isNaN(value.getTime()))
      result[key] = `${date}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}+08:00`
  }
  return result
}
