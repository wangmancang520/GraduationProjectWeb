export function readUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return user && typeof user === 'object' && user.token ? user : null
  } catch (_) {
    localStorage.removeItem('user')
    return null
  }
}

export function roleHome(role) {
  return ({ 1: '/user', 2: '/user', 3: '/classroom-admin', 4: '/manager' })[role] || '/login'
}
