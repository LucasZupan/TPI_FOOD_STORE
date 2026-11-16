import { useEffect } from 'react'
import { useAuth } from '@/features/auth'
import AppRouter from '@/routes/AppRouter'
import Toast from '@/shared/components/Toast'

function App() {
  const { checkSession } = useAuth()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  )
}

export default App