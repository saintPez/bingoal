import { createContext, useEffect, useState, useMemo } from 'react'

const AppContext = createContext(null)

export const UserContextProvider = ({ children }) => {
  const [jwt, setJWT] = useState<boolean | string>(false)

  useEffect(() => {
    if (jwt) {
      window.sessionStorage.setItem('jwt', `${jwt}`)
    } else {
      window.sessionStorage.removeItem('jwt')
    }
  }, [jwt])

  const values = useMemo(() => ({ jwt, setJWT }), [jwt])

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>
}

export default AppContext
