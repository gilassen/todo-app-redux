export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const UNDO_TODOS = 'UNDO_TODOS'
export const SET_LOADING = 'SET_LOADING'
export const SET_TODO = 'SET_TODO'
export const SET_STATS = 'SET_STATS'
export const SET_SORT = 'SET_SORT'
export const SET_PAGE = 'SET_PAGE'

const initialState = {
    todos: [],
    lastTodos: [],
    filterBy: { status: 'all', txt: '', importance: '', sortBy: 'txt', pageIdx: 0, pageSize: 5 },
    isLoading: false,
    stats: null
}

export function todoReducer(state = initialState, cmd) {
    switch (cmd.type) {
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        case SET_TODO:
            const exists = state.todos.some(t => t._id === cmd.todo._id)
            return exists
                ? { ...state, todos: state.todos.map(t => t._id === cmd.todo._id ? cmd.todo : t) }
                : { ...state, todos: [...state.todos, cmd.todo] }

        case ADD_TODO:
            return { ...state, todos: [...state.todos, cmd.todo] }

        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id !== cmd.todoId),
                lastTodos: [...state.todos]
            }

        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo)
            }

        case UNDO_TODOS:
            return { ...state, todos: [...state.lastTodos] }

        case SET_FILTER_BY:
            return { ...state, filterBy: cmd.filterBy }

        case SET_LOADING:
            return { ...state, isLoading: cmd.isLoading }

        case SET_STATS:
            return { ...state, stats: cmd.stats }
        
        case SET_SORT:
            return {
                ...state,
                filterBy: { ...state.filterBy, sortBy: cmd.sortBy }
            }
            
        case SET_PAGE:
            return {
                ...state,
                filterBy: { ...state.filterBy, pageIdx: cmd.pageIdx }
            }

        default:
            return state
    }
}
