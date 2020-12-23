import { useContext, useState, FormEvent } from 'react'
import Router from 'next/router'
import userContext from 'context/userContext'
import styles from 'styles/FormRegister.module.scss'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import DateFnsUtils from '@date-io/date-fns'
import moment from 'moment'

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

    const response = await fetch('api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nickname,
        firstname,
        lastname,
        email,
        password,
        dateOfBirth: `${moment(dateOfBirth).format('YYYY-MM-DD')}`
      })
    })

    const json = await response.json()
    if (!json.success) {
      setErrorNickname('')
      setErrorFirstname('')
      setErrorLastname('')
      setErrorEmail('')
      setErrorPassword('')
      setErrorDateOfBirth('')
      if (Array.isArray(json.error)) {
        for (const error of json.error) {
          if (error.param === 'nickname') setErrorNickname(`${error.msg}`)
          else if (error.param === 'firstname') setErrorFirstname(`${error.msg}`)
          else if (error.param === 'lastname') setErrorLastname(`${error.msg}`)
          else if (error.param === 'email') setErrorEmail(`${error.msg}`)
          else if (error.param === 'password') setErrorPassword(`${error.msg}`)
          else if (error.param === 'dateOfBirth') setErrorDateOfBirth(`${error.msg}`)
        }
        return
      } else {
        if (json.error.param === 'nickname') return setErrorNickname(`${json.error.message}`)
        if (json.error.param === 'firstname') return setErrorFirstname(`${json.error.message}`)
        if (json.error.param === 'lastname') return setErrorLastname(`${json.error.message}`)
        if (json.error.param === 'email') return setErrorEmail(`${json.error.message}`)
        if (json.error.param === 'password') return setErrorPassword(`${json.error.message}`)
        if (json.error.param === 'dateOfBirth') return setErrorDateOfBirth(`${json.error.message}`)
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
