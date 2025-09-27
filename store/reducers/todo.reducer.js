export const SET_TODOS = 'SET_TODOS'
export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const UNDO_TODOS = 'UNDO_TODOS'
export const SET_LOADING = 'SET_LOADING'
export const SET_TODO = 'SET_TODO'
export const SET_STATS = 'SET_STATS'
export const SET_SORT = 'SET_SORT'
export const SET_PAGE = 'SET_PAGE'
export const SET_FILTER_BY = 'SET_FILTER_BY'

const initialState = {
    todos: [],
    lastTodos: [],
    filterBy: { txt: '', status: 'all', importance: 0, pageIdx: 0, sortBy: null },
    todo: null,
    stats: null,
    isLoading: false,
    maxPage: 1
}

export function todoReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        case ADD_TODO:
            return { ...state, todos: [cmd.todo, ...state.todos] }

        case REMOVE_TODO:
            return { ...state, todos: state.todos.filter(todo => todo._id !== cmd.todoId) }

        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo)
            }

        case UNDO_TODOS:
            return { ...state, todos: state.lastTodos }

        case SET_LOADING:
            return { ...state, isLoading: cmd.isLoading }

        case SET_TODO:
            return { ...state, todo: cmd.todo }

        case SET_STATS:
            return { ...state, stats: cmd.stats }

        case SET_SORT:
            return { ...state, filterBy: { ...state.filterBy, sortBy: cmd.sortBy } }

        case SET_PAGE: {
            const nextMaxPage = (cmd.maxPage !== undefined && cmd.maxPage !== null) ? cmd.maxPage : state.maxPage
            const nextPageIdx = (cmd.pageIdx !== undefined && cmd.pageIdx !== null) ? cmd.pageIdx : state.filterBy.pageIdx

            const pageIdxChanged = state.filterBy.pageIdx !== nextPageIdx
            const maxChanged = state.maxPage !== nextMaxPage

            if (!pageIdxChanged && !maxChanged) return state

            return {
                ...state,
                filterBy: pageIdxChanged ? { ...state.filterBy, pageIdx: nextPageIdx } : state.filterBy,
                maxPage: nextMaxPage
            }
        }

        case SET_FILTER_BY: {
            const hasOwnPageIdx = Object.prototype.hasOwnProperty.call(cmd.filterBy || {}, 'pageIdx')
            const nextFilter = { ...state.filterBy, ...cmd.filterBy }
            if (!hasOwnPageIdx) nextFilter.pageIdx = 0
            return { ...state, filterBy: nextFilter }
        }

        default:
            return state
    }
}
