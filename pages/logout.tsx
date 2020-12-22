import { useContext, useEffect } from 'react'
import userContext from 'context/userContext'

export default function Logout () {
  const { setUser, setToken } = useContext(userContext)

  useEffect(function () {
    setUser(false)
    setToken(false)
  })

  return (
    <>
      <h1>Logout</h1>
    </>
  )
}
