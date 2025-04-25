const storeSession = (key, value) => {
    sessionStorage.setItem(key, value)
}

const retrieveSession = (key) => {
    return sessionStorage.getItem(key)
}

const removeSession = (key) => {
    return sessionStorage.removeItem(key)
}

const logout = () => {
    sessionStorage.clear()
}

export {
    storeSession,
    retrieveSession,
    removeSession,
    logout
}

