import { useContext, useState, FormEvent } from 'react'
import Router from 'next/router'
import userContext from 'context/userContext'
import styles from 'styles/components/FormLogin.module.scss'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'

export default function FormLogin () {
  const [showPassword, setShowPassword] = useState(false)
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
  <Box boxShadow={5} borderRadius={10}>
    <ValidatorForm onSubmit={handleSubmit} className={styles.form}>
      <Typography variant='h4'>Login</Typography>
      <div className={styles.input}>
        <TextValidator
          name='email'
          label='Email'
          onChange={(e) => setEmail(`${(e.target as HTMLInputElement).value}`)}
          value={email}
          validators={['required', 'isEmail']}
          errorMessages={['Email is required', 'Email is not valid']}
          error={Boolean(errorEmail)}
          helperText={` ${errorEmail}`}
          fullWidth
        />
      </div>
      <div className={styles.input}>
        <TextValidator
          name='password'
          label='Password'
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(`${(e.target as HTMLInputElement).value}`)}
          value={password}
          validators={['required', 'minStringLength:8']}
          errorMessages={['Password is required', 'Password must be at least 8 characters']}
          error={Boolean(errorPassword)}
          helperText={` ${errorPassword}`}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {showPassword ? <Visibility color='action'/> : <VisibilityOff color='action'/>}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </div>
      <Button type='submit' variant='contained' color='primary' fullWidth>
        Login
      </Button>
    </ValidatorForm>
  </Box>
  )
}
