import { useContext, useState, FormEvent } from 'react'
import Router from 'next/router'
import userContext from 'context/userContext'
import styles from 'styles/Login.module.scss'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const { setToken, setUser } = useContext(userContext)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const response = await fetch('api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const json = await response.json()
    console.log(json)
    if (!json.success) {
      setErrorEmail('')
      setErrorPassword('')
      if (Array.isArray(json.error)) {
        for (const error of json.error) {
          if (error.param === 'email') setErrorEmail(`${error.msg}`)
          else if (error.param === 'password') setErrorPassword(`${error.msg}`)
        }
        return
      } else {
        if (json.error.param === 'email') return setErrorEmail(`${json.error.message}`)
        if (json.error.param === 'password') return setErrorPassword(`${json.error.message}`)
        return
      }
    }
    setToken(json.token)
    setUser(json.data)
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
        <span className={styles.error}>{errorEmail}</span>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <span className={styles.error}>{errorPassword}</span>
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
