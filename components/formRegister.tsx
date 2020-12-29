import { useContext, useState, FormEvent } from 'react'
import Router from 'next/router'
import Axios from 'axios'
import userContext from 'context/userContext'
import styles from 'styles/components/FormRegister.module.scss'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import DateFnsUtils from '@date-io/date-fns'
import moment from 'moment'

import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

export default function FormLogin () {
  const [showPassword, setShowPassword] = useState(false)

  const [nickname, setNickname] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(new Date())

  const [errorNickname, setErrorNickname] = useState('')
  const [errorFirstname, setErrorFirstname] = useState('')
  const [errorLastname, setErrorLastname] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [errorDateOfBirth, setErrorDateOfBirth] = useState('')

  const { setToken, setUser } = useContext(userContext)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const { data } = await Axios.post('/api/register', {
        nickname,
        firstname,
        lastname,
        email,
        password,
        dateOfBirth: `${moment(dateOfBirth).format('YYYY-MM-DD')}`
      })
      setToken(data.token)
      setUser(data.data)
      Router.push('/')
    } catch (error) {
      if (!error.response.data.success) {
        setErrorNickname('')
        setErrorFirstname('')
        setErrorLastname('')
        setErrorEmail('')
        setErrorPassword('')
        setErrorDateOfBirth('')
        if (Array.isArray(error.response.data.error)) {
          for (const err of error.response.data.error) {
            if (err.param === 'nickname') setErrorNickname(`${err.msg}`)
            else if (err.param === 'firstname') setErrorFirstname(`${err.msg}`)
            else if (err.param === 'lastname') setErrorLastname(`${err.msg}`)
            else if (err.param === 'email') setErrorEmail(`${err.msg}`)
            else if (err.param === 'password') setErrorPassword(`${err.msg}`)
            else if (err.param === 'dateOfBirth') setErrorDateOfBirth(`${err.msg}`)
          }
          return
        } else {
          if (error.response.data.error.param === 'nickname') return setErrorNickname(`${error.response.data.error.message}`)
          if (error.response.data.error.param === 'firstname') return setErrorFirstname(`${error.response.data.error.message}`)
          if (error.response.data.error.param === 'lastname') return setErrorLastname(`${error.response.data.error.message}`)
          if (error.response.data.error.param === 'email') return setErrorEmail(`${error.response.data.error.message}`)
          if (error.response.data.error.param === 'password') return setErrorPassword(`${error.response.data.error.message}`)
          if (error.response.data.error.param === 'dateOfBirth') return setErrorDateOfBirth(`${error.response.data.error.message}`)
          return
        }
      }
    }
  }

  return (
  <Box boxShadow={5} borderRadius={10}>
    <ValidatorForm onSubmit={handleSubmit} className={styles.form}>
      <Typography variant='h4'>Register</Typography>
      <div className={styles.input}>
        <TextValidator
          name='nickname'
          label='Nickname'
          onChange={(e) => setNickname(`${(e.target as HTMLInputElement).value}`)}
          value={nickname}
          validators={['required', 'minStringLength:4']}
          errorMessages={['Nickname is required', 'Nickname must be at least 4 characters']}
          error={Boolean(errorNickname)}
          helperText={` ${errorNickname}`}
          fullWidth
        />
      </div>
      <div className={styles.input}>
        <TextValidator
          name='firstname'
          label='Firstname'
          onChange={(e) => setFirstname(`${(e.target as HTMLInputElement).value}`)}
          value={firstname}
          validators={['required', 'minStringLength:4']}
          errorMessages={['Firstname is required', 'Firstname must be at least 4 characters']}
          error={Boolean(errorFirstname)}
          helperText={` ${errorFirstname}`}
          fullWidth
        />
      </div>
      <div className={styles.input}>
        <TextValidator
          name='lastname'
          label='Lastname'
          onChange={(e) => setLastname(`${(e.target as HTMLInputElement).value}`)}
          value={lastname}
          validators={['required', 'minStringLength:4']}
          errorMessages={['Lastname is required', 'Lastname must be at least 4 characters']}
          error={Boolean(errorLastname)}
          helperText={` ${errorLastname}`}
          fullWidth
        />
      </div>
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
      <div className={styles.input}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="yyyy-MM-dd"
            margin="normal"
            id="dateOfBirth"
            label="Date Of Birth"
            value={dateOfBirth}
            onChange={(date: Date | null) => setDateOfBirth(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date'
            }}
            error={Boolean(errorDateOfBirth)}
            helperText={` ${errorDateOfBirth}`}
          />
        </MuiPickersUtilsProvider>
      </div>
      <Button type='submit' variant='contained' color='primary' fullWidth>
        Login
      </Button>
    </ValidatorForm>
  </Box>
  )
}
