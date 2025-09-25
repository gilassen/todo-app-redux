import { todoService, SET_SORT, SET_PAGE } from "../../services/todo.service.js"
import { userService } from "../../services/user.service.js"
import { updateUser } from "./user.actions.js"

import { 
    ADD_TODO, 
    REMOVE_TODO, 
    SET_TODOS, 
    UPDATE_TODO, 
    UNDO_TODOS, 
    SET_LOADING,
    SET_TODO,
    SET_STATS
} from "../reducers/todo.reducer.js"
import { store } from "../store.js"

export function loadTodos(filterBy) {
    store.dispatch({ type: SET_LOADING, isLoading: true })
    return todoService.query(filterBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
            store.dispatch({ type: SET_LOADING, isLoading: false })
            return todos
        })
        .catch(err => {
            console.log('todo action -> Cannot load todos', err)
            store.dispatch({ type: SET_LOADING, isLoading: false })
            throw err
        })
}

export function loadTodoById(todoId) {
    store.dispatch({ type: SET_LOADING, isLoading: true })
    return todoService.get(todoId)
        .then(todo => {
            store.dispatch({ type: SET_TODO, todo })
            store.dispatch({ type: SET_LOADING, isLoading: false })
            return todo
        })
        .catch(err => {
            console.log("todo action -> Cannot load todo", err)
            store.dispatch({ type: SET_LOADING, isLoading: false })
            throw err
        })
}

export function loadStats() {
    store.dispatch({ type: SET_LOADING, isLoading: true })
    return todoService.getImportanceStats()
        .then(stats => {
            store.dispatch({ type: SET_STATS, stats })
            store.dispatch({ type: SET_LOADING, isLoading: false })
            return stats
        })
        .catch(err => {
            console.log("todo action -> Cannot load stats", err)
            store.dispatch({ type: SET_LOADING, isLoading: false })
            throw err
        })
}

export function removeTodoOptimistic(todoId) {
    store.dispatch({ type: REMOVE_TODO, todoId })
    return todoService.remove(todoId)
        .catch(err => {
            store.dispatch({ type: UNDO_TODOS })
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

export function removeTodo(todoId) {
    return todoService.remove(todoId)
        .then(() => {
            store.dispatch({ type: REMOVE_TODO, todoId })
        })
        .catch(err => {
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

export function saveTodo(todo) {
    const type = todo._id ? UPDATE_TODO : ADD_TODO
    const isUpdate = Boolean(todo._id)

    return todoService.save(todo)
        .then((savedTodo) => {
            store.dispatch({ type, todo: savedTodo })

            if (isUpdate && savedTodo.isDone) {
                const loggedInUser = userService.getLoggedinUser()
                if (loggedInUser) {
                    const updatedUser = {
                        ...loggedInUser,
                        balance: (loggedInUser.balance || 0) + 10
                    }
                    userService.addActivity(loggedInUser._id, `Completed a Todo: '${savedTodo.txt}'`)
                    updateUser(updatedUser)
                }
            }

            return savedTodo
        })
        .catch(err => {
            console.log('todo action -> Cannot save todo', err)
            throw err
        })
}

export function setSort(sortBy) {
    return { type: SET_SORT, sortBy }
}

export function setPage(pageIdx) {
    return { type: SET_PAGE, pageIdx }
}
