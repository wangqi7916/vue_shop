import service from '../utils/service.js'

export function login (data) {
  return service({
    url: '/api/login',
    method: 'POST',
    data
  })
}
