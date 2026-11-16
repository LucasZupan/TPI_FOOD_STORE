import { useEffect } from 'react'

import { useNotificationStore } from '@/store/notificationStore'


function Toast() {
  const message = useNotificationStore(
    (state) => state.message,
  )

  const visible = useNotificationStore(
    (state) => state.visible,
  )

  const hideNotification =
    useNotificationStore(
      (state) => state.hideNotification,
    )


  useEffect(() => {
    if (!visible) {
      return
    }

    const timeout = setTimeout(() => {
      hideNotification()
    }, 3000)

    return () => {
      clearTimeout(timeout)
    }
  }, [
    visible,
    hideNotification,
  ])


  if (!visible) {
    return null
  }


  return (
    <div className="fixed right-4 top-4 z-50 rounded bg-gray-900 px-4 py-3 text-white shadow-lg">
      {message}
    </div>
  )
}

export default Toast