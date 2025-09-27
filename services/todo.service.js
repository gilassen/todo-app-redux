import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'

const TODO_KEY = 'todoDB'
_createTodos()

export const todoService = {
    query,
    get,
    remove,
    save,
    getEmptyTodo,
    getDefaultFilter,
    getFilterFromSearchParams,
    getImportanceStats,
}
window.cs = todoService

function query(filterBy = {}) {
    return storageService.query(TODO_KEY)
        .then(todos => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                todos = todos.filter(todo => regExp.test(todo.txt))
            }

            if (filterBy.importance) {
                todos = todos.filter(todo => todo.importance >= filterBy.importance)
            }

            if (filterBy.status && filterBy.status !== 'all') {
                if (filterBy.status === 'active') {
                    todos = todos.filter(todo => !todo.isDone)
                } else if (filterBy.status === 'done') {
                    todos = todos.filter(todo => todo.isDone)
                }
            }

            if (filterBy.sortBy) {
                if (filterBy.sortBy === 'txt') {
                    todos = todos.sort((a, b) => a.txt.localeCompare(b.txt))
                } else if (filterBy.sortBy === 'importance') {
                    todos = todos.sort((a, b) => b.importance - a.importance)
                }
            }

            // --- פאג'ינציה מתוקנת ---
            const pageSize = filterBy.pageSize || 5
            const totalTodos = todos.length
            const maxPage = Math.ceil(totalTodos / pageSize) || 1

            let pageIdx = (typeof filterBy.pageIdx === 'number') ? filterBy.pageIdx : 0
            if (pageIdx >= maxPage) pageIdx = Math.max(maxPage - 1, 0)

            const startIdx = pageIdx * pageSize
            const todosPage = todos.slice(startIdx, startIdx + pageSize)

            return { todos: todosPage, maxPage, pageIdx }
        })
}

function get(todoId) {
    return storageService.get(TODO_KEY, todoId)
        .then(todo => {
            todo = _setNextPrevTodoId(todo)
            return todo
        })
}

function remove(todoId) {
    return storageService.remove(TODO_KEY, todoId)
        .then(() => {
            userService.addActivity(`Removed a Todo (id: ${todoId})`)
        })
}

function save(todo) {
    if (todo._id) {
        todo.updatedAt = Date.now()
        return storageService.put(TODO_KEY, todo)
            .then(savedTodo => {
                userService.addActivity(`Updated a Todo: '${savedTodo.txt}'`)
                return savedTodo
            })
    } else {
        todo.createdAt = todo.updatedAt = Date.now()
        return storageService.post(TODO_KEY, todo)
            .then(savedTodo => {
                userService.addActivity(`Added a Todo: '${savedTodo.txt}'`)
                return savedTodo
            })
    }
}

function getEmptyTodo(txt = '', importance = 5, color = '#F44236') {
    return { txt, importance, isDone: false, color }
}

function getDefaultFilter() {
    return { txt: '', importance: 0, status: 'all' }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
}

function getImportanceStats() {
    return storageService.query(TODO_KEY)
        .then(todos => {
            const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
            const data = Object.keys(todoCountByImportanceMap).map(speedName => ({
                title: speedName,
                value: todoCountByImportanceMap[speedName]
            }))
            return data
        })
}

function _createTodos() {
    let todos = utilService.loadFromStorage(TODO_KEY)
    if (!todos || !todos.length) {
        todos = []
        const txts = ['Learn React', 'Master CSS', 'Practice Redux']
        for (let i = 0; i < 20; i++) {
            const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
            todos.push(_createTodo(txt + (i + 1), utilService.getRandomIntInclusive(1, 10)))
        }
        utilService.saveToStorage(TODO_KEY, todos)
    }
}

function _createTodo(txt, importance) {
    const todo = getEmptyTodo(txt, importance)
    todo._id = utilService.makeId()
    todo.createdAt = todo.updatedAt = Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
    return todo
}

function _setNextPrevTodoId(todo) {
    return storageService.query(TODO_KEY).then((todos) => {
        const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
        const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
        const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
        todo.nextTodoId = nextTodo._id
        todo.prevTodoId = prevTodo._id
        return todo
    })
}

function _getTodoCountByImportanceMap(todos) {
    return todos.reduce((map, todo) => {
        if (todo.importance < 3) map.low++
        else if (todo.importance < 7) map.normal++
        else map.urgent++
        return map
    }, { low: 0, normal: 0, urgent: 0 })
}
