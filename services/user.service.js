import { storageService } from "./async-storage.service.js"

export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    timeAgo,
    save,
    addActivity,
}

const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username && user.password === password)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname }) {
    const user = { 
        username, 
        password, 
        fullname,
        balance: 10000,
        activities: [],
        prefs: {},                 // ✅ נוספו העדפות ברירת מחדל
        createdAt: Date.now(),
        updatedAt: Date.now()
    }

    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    localStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN)) ||
           JSON.parse(localStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = {
        _id: user._id,
        fullname: user.fullname,
        balance: user.balance || 10000,
        activities: user.activities || [],
        prefs: user.prefs || {} 
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}


function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
    }
}

function save(user) {
    if (user._id) {
        return storageService.put(STORAGE_KEY, user).then(savedUser => {
            const loggedinUser = getLoggedinUser()
            if (loggedinUser && loggedinUser._id === savedUser._id) {
                sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(savedUser))
            }
            return savedUser
        })
    } else {
        return storageService.post(STORAGE_KEY, user).then(savedUser => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(savedUser))
            return savedUser
        })
    }
}


function timeAgo(timestamp) {
    const now = Date.now()
    const diff = now - timestamp

    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) return `${seconds} seconds ago`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Couple of hours ago`

    const days = Math.floor(hours / 24)
    return `${days} days ago`
}

function addActivity(txt) {
    const user = getLoggedinUser()
    if (!user) return

    const activity = {
        txt,
        at: Date.now()
    }

    if (!user.activities) user.activities = []
    user.activities.unshift(activity) 

    save(user)
    _setLoggedinUser(user)

    return activity
}

// יצירת משתמש דמו ראשוני
signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999,
//     balance: 10000,
//     activities: [],
//     prefs: { color: '', bgColor: '' }
// }
