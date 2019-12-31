import service from '../utils/service.js'

export function addRoute(data) {
  return service({
    url: '/api/addRoute',
    method: 'POST',
    data
  })
}

export function getRoutes() {
  return service({
    url: '/api/getRoutes',
    method: 'GET'
  })
}

export function editRoute(data) {
  return service({
    url: '/api/editRoute',
    method: 'PUT',
    data
  })
}

export function deleteRoute(data) {
  return service({
    url: '/api/deleteRoute',
    method: 'DELETE',
    data
  })
}
