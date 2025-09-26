const { useSelector } = ReactRedux
const { useState } = React

import { updateUserPrefs } from "../store/actions/user.actions.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"

export function UserProfileForm() {
  const user = useSelector(state => state.userModule.loggedInUser)

  const [color, setColor] = useState(
    (user && user.prefs && user.prefs.color) ? user.prefs.color : "#000000"
  )
  const [bgColor, setBgColor] = useState(
    (user && user.prefs && user.prefs.bgColor) ? user.prefs.bgColor : "#ffffff"
  )

  function onSave(ev) {
    ev.preventDefault()
    const prefs = { color, bgColor }

    updateUserPrefs(prefs)
      .then(() => showSuccessMsg("Preferences updated successfully"))
      .catch(() => showErrorMsg("Failed to update preferences"))
  }

  return (
    <section className="user-profile-form">
      <h2>Profile Preferences</h2>
      <form onSubmit={onSave}>
        <label>
          Text Color:
          <input
            type="color"
            value={color}
            onChange={(ev) => setColor(ev.target.value)}
          />
        </label>

        <label>
          Background Color:
          <input
            type="color"
            value={bgColor}
            onChange={(ev) => setBgColor(ev.target.value)}
          />
        </label>

        <button type="submit">Save</button>
      </form>
    </section>
  )
}
