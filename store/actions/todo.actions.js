import { todoService } from "../../services/todo.service.js"
import { 
    ADD_TODO, 
    REMOVE_TODO, 
    SET_TODOS, 
    UPDATE_TODO, 
    UNDO_TODOS, 
    SET_LOADING,
    SET_TODO
} from "../reducers/todo.reducer.js"
import { store } from "../store.js"

export function loadTodos(filterBy) {
    store.dispatch({ type: SET_LOADING, isLoading: true })
    return todoService.query(filterBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
            store.dispatch({ type: SET_LOADING, isLoading: false })
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
    return todoService.save(todo)
        .then((savedTodo) => {
            store.dispatch({ type, todo: savedTodo })
            return savedTodo
        })
        .catch(err => {
            console.log('todo action -> Cannot save todo', err)
            throw err
        })
}
