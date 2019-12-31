import service from '../utils/service.js'

export function getAllRoles () {
  return service({
    url: '/api/getRoles',
    method: 'GET'
  })
}

export function addRole(data) {
  return service({
    url: '/api/addRole',
    method: 'POST',
    data
  })
}

export function updateRole(data) {
  return service({
    url: '/api/updateRole',
    method: 'POST',
    data
  })
}
