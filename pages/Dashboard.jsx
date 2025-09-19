const { useEffect } = React
const { useSelector } = ReactRedux
import { loadTodos, loadStats } from "../store/actions/todo.actions.js"
import { Chart } from "../cmps/Chart.jsx"

export function Dashboard() {
    const todos = useSelector(storeState => storeState.todoModule.todos)
    const stats = useSelector(storeState => storeState.todoModule.stats)
    const isLoading = useSelector(storeState => storeState.todoModule.isLoading)

    useEffect(() => {
        if (!todos.length) loadTodos()
        if (!stats) loadStats()
    }, [todos.length, stats])

    if (isLoading && !stats) return <div>Loading...</div>

    return (
        <section className="dashboard">
            <h2>Todos Statistics</h2>
            {stats && <Chart stats={stats} />}
        </section>
    )
}
