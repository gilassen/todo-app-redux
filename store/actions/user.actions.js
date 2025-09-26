import { userService } from "../../services/user.service.js"
import { SET_USER, SET_USER_SCORE, UPDATE_USER_PREFS } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export function login(credentials) {
    return userService.login(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('user actions -> Cannot login', err)
            throw err
        })
}

export function signup(credentials) {
    return userService.signup(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('user actions -> Cannot signup', err)
            throw err
        })
}

export function logout() {
    return userService.logout()
        .then(() => {
            store.dispatch({ type: SET_USER, user: null })
        })
        .catch((err) => {
            console.log('user actions -> Cannot logout', err)
            throw err
        })
}

export function checkout(diff) {
    return userService.updateScore(-diff)
        .then(newScore => {
            store.dispatch({ type: SET_USER_SCORE, score: newScore })
            store.dispatch({ type: TOGGLE_CART_IS_SHOWN })
            store.dispatch({ type: CLEAR_CART })
        })
        .catch((err) => {
            console.log('user actions -> Cannot checkout', err)
            throw err
        })
}

export function updateUser(user) {
    return userService.save(user)
        .then(savedUser => {
            store.dispatch({ type: SET_USER, user: savedUser })
            return savedUser
        })
        .catch(err => {
            console.error('user actions -> Cannot update user', err)
            throw err
        })
}

export function updateUserPrefs(prefs) {
    const loggedInUser = userService.getLoggedinUser()
    if (!loggedInUser) return Promise.reject("No logged in user")

    const updatedUser = {
        ...loggedInUser,
        prefs: { ...(loggedInUser.prefs || {}), ...prefs }
    }

    return userService.save(updatedUser)
        .then(savedUser => {
            store.dispatch({ type: UPDATE_USER_PREFS, prefs: savedUser.prefs })
            return savedUser
        })
        .catch(err => {
            console.error('user actions -> Cannot update user prefs', err)
            throw err
        })
}
