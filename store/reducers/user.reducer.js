export const SET_USER = 'SET_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const SET_USER_SCORE = 'SET_USER_SCORE'
export const UPDATE_USER_PREFS = 'UPDATE_USER_PREFS' // ✅ חדש

const initialState = {
  loggedInUser: null,
}

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, loggedInUser: action.user }

    case LOGOUT_USER:
      return { ...state, loggedInUser: null }

    case SET_USER_SCORE:
      return {
        ...state,
        loggedInUser: { ...state.loggedInUser, score: action.score },
      }

    case UPDATE_USER_PREFS:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          prefs: {
            ...((state.loggedInUser && state.loggedInUser.prefs) || {}),
            ...action.prefs,
          },
        },
      }

    default:
      return state
  }
}
