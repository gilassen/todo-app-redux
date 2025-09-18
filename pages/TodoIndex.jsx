import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo } from "../sore/actions/todo.actions.js"
import { SET_FILTER_BY } from "../sore/reducers/todo.reducer.js"

const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux
const { useEffect } = React

export function TodoIndex() {

    const todos = useSelector(storeState => storeState.todoModule.todos)
    const filterBy = useSelector(storeState => storeState.todoModule.filterBy)
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos(filterBy)
            .catch(() => showErrorMsg("Cannot load todos"))
    }, [filterBy])

    function onRemoveTodo(todoId) {
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

    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}
