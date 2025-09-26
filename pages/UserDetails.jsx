import { userService } from "../services/user.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import { UserProfileForm } from "../cmps/UserProfileForm.jsx"

const { useSelector } = ReactRedux
const { useParams } = ReactRouter
const { useState, useEffect } = React

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

  if (!user) return <div>Loading...</div>

  return (
    <section
      className="user-details"
      style={{
        backgroundColor: "white", 
        color: "black"        
      }}
    >
      <h2>Profile</h2>

      <UserProfileForm user={user} />

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
