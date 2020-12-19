import { useContext, useState, FormEvent } from 'react'
import Router from 'next/router'
import userContext from 'context/userContext'
import login from 'services/login'
import styles from 'styles/Login.module.scss'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState('')
  const { setJWT } = useContext(userContext)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await login(email, password)
    if (!res.success) return setValue('error')
    setJWT(res.token)
    Router.push('/')
  }

  return (
    <main>
      <h1 className={styles.title}>Bingo</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.description}>Login to Bingo</p>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  )
}
