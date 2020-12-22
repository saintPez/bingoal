import { createContext, useEffect, useState, useMemo } from 'react'

const AppContext = createContext(null)

export const UserContextProvider = ({ children }) => {
  const [token, setToken] = useState<boolean | string>(false)
  const [user, setUser] = useState<boolean | object>(false)

  useEffect(() => {
    if (token) localStorage.setItem('BINGOAL_TOKEN', `${token}`)
    else localStorage.removeItem('BINGOAL_TOKEN')
  }, [token])

  const values = useMemo(() => ({ token, setToken, user, setUser }), [token, user])

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>
}

export default AppContext
