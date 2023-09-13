export const getLocalStore = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

export const setLocalStore = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val))
}

export const rmLocalStore = (key) => {
  localStorage.removeItem(key)
}
