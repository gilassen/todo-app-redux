import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams, useNavigate, Link } from "react-router-dom"
import { loadTodoById } from "../store/actions/todo.actions.js"
import { showErrorMsg } from "../services/event-bus.service.js"

export function TodoDetails() {
    const { todoId } = useParams()
    const navigate = useNavigate()

    const todo = useSelector(storeState =>
        storeState.todoModule.todos.find(t => t._id === todoId)
    )

    useEffect(() => {
        if (!todo) {
            loadTodoById(todoId)
                .catch(() => {
                    showErrorMsg("Cannot load todo")
                    navigate("/todo")
                })
        }
    }, [todoId, todo])

    if (!todo) return <div>Loading...</div>

    return (
        <section className="todo-details">
            <h1 className={todo.isDone ? "done" : ""}>{todo.txt}</h1>
            <h2>{todo.isDone ? "Done!" : "In your list"}</h2>

            <h1>Todo importance: {todo.importance}</h1>
            <button onClick={() => navigate("/todo")}>Back to list</button>

            {todo.nextTodoId && todo.prevTodoId && (
                <div>
                    <Link to={`/todo/${todo.nextTodoId}`}>Next Todo</Link> |
                    <Link to={`/todo/${todo.prevTodoId}`}>Previous Todo</Link>
                </div>
            )}
        </section>
    )
}
