// localStorage 存储token
let storage = window.localStorage
function setStorage (name, val) {
  return storage.setItem(name, val)
}

function getStorage (name) {
  return storage.getItem(name)
}

function removeStorage (name) {
  return storage.removeItem(name)
}

function clearStorage () {
  return storage.clear()
}

export { setStorage, getStorage, removeStorage, clearStorage }
