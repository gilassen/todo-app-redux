const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector } = ReactRedux

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from "./LoginSignup.jsx"
import { logout } from "../store/actions/user.actions.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

export function AppHeader() {
    const navigate = useNavigate()

    const user = useSelector(storeState => storeState.userModule.loggedInUser) // שים לב לשם אחיד
    const todos = useSelector(storeState => storeState.todoModule.todos)

    const doneTodos = todos.filter(t => t.isDone).length
    const percentDone = todos.length ? Math.round((doneTodos / todos.length) * 100) : 0

    function onLogout() {
        logout()
            .then(() => {
                showSuccessMsg("Logged out successfully")
                navigate("/")
            })
            .catch(() => showErrorMsg("Oops try again"))
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    <section className="user-info">
                        <Link to={`/user/${user._id}`}>
                            Hello {user.fullname}{" "}
                            <span className="balance">| Balance: {user.balance || 0}</span>
                        </Link>
                        <button onClick={onLogout}>Logout</button>
                    </section>
                ) : (
                    <section>
                        <LoginSignup />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/todo">Todos</NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    {user && <NavLink to={`/user/${user._id}`}>User Details</NavLink>}
                </nav>
            </section>

            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: percentDone + "%" }}>
                    {percentDone}%
                </div>
            </div>

            <UserMsg />
        </header>
    )
}
