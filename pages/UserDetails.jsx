const { useSelector } = ReactRedux
const { useParams } = ReactRouter
const { useState, useEffect } = React

import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { updateUser } from "../store/actions/user.actions.js"

export function UserDetails() {
    const { id } = useParams()
    const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)

    const [user, setUser] = useState(null)

    useEffect(() => {
        async function loadUser() {
            try {
                if (loggedInUser && loggedInUser._id === id) {
                    setUser({ ...loggedInUser })
                } else {
                    const otherUser = await userService.getById(id)
                    if (otherUser) setUser(otherUser)
                    else showErrorMsg("Cannot load user")
                }
            } catch (err) {
                showErrorMsg("Cannot load user")
            }
        }
        loadUser()
    }, [id, loggedInUser])

    function handleChange({ target }) {
        const { name, value } = target
        setUser(prev => ({ ...prev, [name]: value }))
    }

    function handlePrefsChange({ target }) {
        const { name, value } = target
        setUser(prev => ({
            ...prev,
            prefs: { ...(prev.prefs || {}), [name]: value }
        }))
    }

    async function onSave(ev) {
        ev.preventDefault()
        try {
            await updateUser(user)
            showSuccessMsg("Profile updated")
        } catch (err) {
            showErrorMsg("Cannot update user")
        }
    }

    if (!user) return <div>Loading...</div>

    return (
        <section
            className="user-details"
            style={{
                color: (user.prefs && user.prefs.color) || "#000000",
                backgroundColor: (user.prefs && user.prefs.bgColor) || "#ffffff"
            }}
        >
            <h2>Profile</h2>
            <form onSubmit={onSave}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="fullname"
                        value={user.fullname}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Color:
                    <input
                        type="color"
                        name="color"
                        value={(user.prefs && user.prefs.color) || "#000000"}
                        onChange={handlePrefsChange}
                    />
                </label>
                <label>
                    BG Color:
                    <input
                        type="color"
                        name="bgColor"
                        value={(user.prefs && user.prefs.bgColor) || "#ffffff"}
                        onChange={handlePrefsChange}
                    />
                </label>
                <button type="submit">Save</button>
            </form>

            <h3>Activities</h3>
            <ul>
                {user.activities &&
                    user.activities.map((act, idx) => (
                        <li key={idx}>
                            {userService.timeAgo(act.at)}: {act.txt}
                        </li>
                    ))}
            </ul>
        </section>
    )
}
