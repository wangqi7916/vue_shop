import service from '../utils/service.js'

export function login (data) {
  return service({
    url: '/api/login',
    method: 'POST',
    data
  })
}

export function getAllUsers () {
  return service({
    url: '/api/getUserAll',
    method: 'GET'
  })
}

export function updateUser (data) {
  return service({
    url: '/api/updateUser',
    method: 'PUT',
    data
  })
}

export function addUser (data) {
  return service({
    url: '/api/addUser',
    method: 'POST',
    data
  })
}

export function deleteUser (data) {
  return service({
    url: '/api/deleteUser',
    method: 'Delete',
    data
  })
}
