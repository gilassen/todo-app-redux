import { todoService } from "../../services/todo.service.js"
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
    SET_STATS,
    SET_SORT,
    SET_PAGE 
} from "../reducers/todo.reducer.js"
import { store } from "../store.js"

export function loadTodos(filterBy) {
    store.dispatch({ type: SET_LOADING, isLoading: true })
    return todoService.query(filterBy)
        .then(({ todos, maxPage, pageIdx }) => {
            store.dispatch({ type: SET_TODOS, todos })

            const { filterBy: currFilter, maxPage: currMax } = store.getState().todoModule
            const pageIdxChanged = currFilter.pageIdx !== pageIdx
            const maxPageChanged = currMax !== maxPage

            if (pageIdxChanged || maxPageChanged) {
                store.dispatch({ type: SET_PAGE, pageIdx, maxPage })
            }

            return todos
        })
        .catch(err => {
            console.log('todo action -> Cannot load todos', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_LOADING, isLoading: false })
        })
}

export function loadTodoById(todoId) {
    return todoService.get(todoId)
        .then(todo => {
            store.dispatch({ type: SET_TODO, todo })
            return todo
        })
        .catch(err => {
            console.log("todo action -> Cannot load todo", err)
            throw err
        })
}

export function loadStats() {
    return todoService.getImportanceStats()
        .then(stats => {
            store.dispatch({ type: SET_STATS, stats })
            return stats
        })
        .catch(err => {
            console.log("todo action -> Cannot load stats", err)
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
            const { todos, filterBy, maxPage } = store.getState().todoModule
            let newPageIdx = filterBy.pageIdx
            if (todos.length === 1 && newPageIdx > 0) {
                newPageIdx = newPageIdx - 1
            }
            store.dispatch({ type: REMOVE_TODO, todoId })
            store.dispatch({ type: SET_PAGE, pageIdx: newPageIdx, maxPage })
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
        .then(savedTodo => {
            store.dispatch({ type, todo: savedTodo })
            return todoService.query(store.getState().todoModule.filterBy)
                .then(({ maxPage, pageIdx }) => {
                    store.dispatch({ type: SET_PAGE, pageIdx, maxPage })

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
        })
        .catch(err => {
            console.log('todo action -> Cannot save todo', err)
            throw err
        })
}

export function setSort(sortBy) {
    store.dispatch({ type: SET_SORT, sortBy })
}

export function setPage(pageIdx, maxPage) {
    store.dispatch({ type: SET_PAGE, pageIdx, maxPage })
}
