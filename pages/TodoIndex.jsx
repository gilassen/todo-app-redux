import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { showErrorMsg, showSuccessMsg, eventBusService } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo } from "../store/actions/todo.actions.js"
import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js"

const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux
const { useEffect, useState } = React

export function TodoIndex() {

    const todos = useSelector(storeState => storeState.todoModule.todos)
    const filterBy = useSelector(storeState => storeState.todoModule.filterBy)
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setSearchParams(filterBy)

        eventBusService.emit('show-loader')

        loadTodos(filterBy)
            .catch(() => showErrorMsg("Cannot load todos"))
            .finally(() => {
                setIsLoaded(true)                
                eventBusService.emit('hide-loader') 
            })
    }, [filterBy])

    function onRemoveTodo(todoId) {
        const isConfirmed = window.confirm("Are you sure you want to delete this todo?")
        if (!isConfirmed) return

        removeTodo(todoId)
            .then(() => showSuccessMsg(`Todo removed`))
            .catch(() => showErrorMsg("Cannot remove todo " + todoId))
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then(savedTodo => {
                showSuccessMsg(`Todo is ${savedTodo.isDone ? "done" : "back on your list"}`)
            })
            .catch(() => showErrorMsg("Cannot toggle todo " + todo._id))
    }

    function onSetFilterBy(newFilter) {
        dispatch({ type: SET_FILTER_BY, filterBy: newFilter })
    }

    if (!isLoaded) return null

    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>

            <h2>Todos List</h2>

            {todos.length === 0 ? (
                <p>No todos to show...</p>
            ) : (
                <React.Fragment>
                    <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
                    <hr />
                    <h2>Todos Table</h2>
                    <div style={{ width: '60%', margin: 'auto' }}>
                        <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
                    </div>
                </React.Fragment>
            )}
        </section>
    )
}
