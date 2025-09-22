const { useState, useEffect } = React
import { eventBusService } from '../services/event-bus.service.js'

export function AppLoader() {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const offShow = eventBusService.on('show-loader', () => setIsLoading(true))
    const offHide = eventBusService.on('hide-loader', () => setIsLoading(false))

    return () => {
      offShow()
      offHide()
    }
  }, [])

  if (!isLoading) return null

  return (
    <section className="app-loader">
      <div className="spinner"></div>
      <p>Loading...</p>
    </section>
  )
}
