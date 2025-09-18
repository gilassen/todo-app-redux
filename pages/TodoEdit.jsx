import { saveTodo, loadTodos } from "../sore/actions/todo.actions.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM
const { useSelector } = ReactRedux

export function TodoEdit() {

    const [todoToEdit, setTodoToEdit] = useState(null)
    const todos = useSelector(storeState => storeState.todoModule.todos)

    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.todoId) {
            const todo = todos.find(t => t._id === params.todoId)
            if (todo) setTodoToEdit(todo)
            else {
                loadTodos()
                    .then(() => {
                        const loadedTodo = todos.find(t => t._id === params.todoId)
                        if (loadedTodo) setTodoToEdit(loadedTodo)
                    })
                    .catch(() => showErrorMsg("Cannot load todo"))
            }
        } else {
            setTodoToEdit({ txt: "", importance: 1, isDone: false })
        }
    }, [params.todoId, todos])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case "number":
            case "range":
                value = +value || ""
                break
            case "checkbox":
                value = target.checked
                break
            default:
                break
        }

        setTodoToEdit(prev => ({ ...prev, [field]: value }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        saveTodo(todoToEdit)
            .then((savedTodo) => {
                showSuccessMsg(`Todo Saved (id: ${savedTodo._id})`)
                navigate("/todo")
            })
            .catch(() => showErrorMsg("Cannot save todo"))
    }

    if (!todoToEdit) return <div>Loading...</div>

    const { txt, importance, isDone } = todoToEdit

    return (
        <section className="todo-edit">
            <form onSubmit={onSaveTodo}>
                <label htmlFor="txt">Text:</label>
                <input onChange={handleChange} value={txt} type="text" name="txt" id="txt" />

                <label htmlFor="importance">Importance:</label>
                <input onChange={handleChange} value={importance} type="number" name="importance" id="importance" />

                <label htmlFor="isDone">isDone:</label>
                <input onChange={handleChange} checked={isDone} type="checkbox" name="isDone" id="isDone" />

                <button>Save</button>
            </form>
        </section>
    )
}
