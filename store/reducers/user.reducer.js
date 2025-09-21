export const SET_USER = 'SET_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const SET_USER_SCORE = 'SET_USER_SCORE'

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

    default:
      return state
  }
}
