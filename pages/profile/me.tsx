import { useContext, useEffect, useState, FormEvent } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import userContext from 'context/userContext'
import styles from 'styles/profile/me.module.scss'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import CircularProgress from '@material-ui/core/CircularProgress'
import Toolbar from '@material-ui/core/Toolbar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import DateFnsUtils from '@date-io/date-fns'
// import moment from 'moment'

import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import PersonIcon from '@material-ui/icons/Person'
import GradeIcon from '@material-ui/icons/Grade'
import HistoryIcon from '@material-ui/icons/History'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

export default function Me () {
  const { user, loadingUser } = useContext(userContext)
  const [container, setContainer] = useState('Profile')

  const [disabled, setDisabled] = useState(true)

  const [showPassword, setShowPassword] = useState(false)

  const [nickname, setNickname] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(new Date())

  // const [errorNickname, setErrorNickname] = useState('')
  // const [errorFirstname, setErrorFirstname] = useState('')
  // const [errorLastname, setErrorLastname] = useState('')
  // const [errorEmail, setErrorEmail] = useState('')
  // const [errorPassword, setErrorPassword] = useState('')
  // const [errorDateOfBirth, setErrorDateOfBirth] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    console.log(e)
  }

  const handleReset = () => {
    setNickname(user.nickname)
    setFirstname(user.firstname)
    setLastname(user.lastname)
    setEmail(user.email)
    setPassword(user.password)
    setDateOfBirth(new Date(user.dateOfBirth))
  }

  useEffect(() => {
    if (!loadingUser && !user) Router.push('/')
    handleReset()
  }, [loadingUser])

  const switchContainer = () => {
    switch (container) {
      case 'Profile':
        return (<>
          <Avatar className={styles.avatar}>{`${user.firstname.substr(0, 1)}${user.lastname.substr(0, 1)}`}</Avatar>
          <Typography variant='h5' component='h1' color='textPrimary'>{`${user.firstname} ${user.lastname}`}</Typography>
          <Typography variant='h6' component='h2' color='textSecondary'>{`${user.nickname}#${user.hash}`}</Typography>

          <Box boxShadow={5} borderRadius={10} className={styles.box}>
            <ValidatorForm onSubmit={handleSubmit} className={styles.form}>
              <Grid container spacing={3} className={styles.grid}>
                <Grid item xs={12} md={4}>
                  <TextValidator
                    disabled={disabled}
                    name="firstname"
                    label="Firstname"
                    value={firstname}
                    variant="filled"
                    fullWidth
                    onChange={(e) => setFirstname(`${(e.target as HTMLInputElement).value}`)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextValidator
                    disabled={disabled}
                    name="lastname"
                    label="Lastname"
                    value={lastname}
                    variant="filled"
                    fullWidth
                    onChange={(e) => setLastname(`${(e.target as HTMLInputElement).value}`)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextValidator
                    disabled={disabled}
                    name="nickname"
                    label="Nickname"
                    value={nickname}
                    variant="filled"
                    fullWidth
                    onChange={(e) => setNickname(`${(e.target as HTMLInputElement).value}`)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextValidator
                    disabled={disabled}
                    name="email"
                    label="Email"
                    value={email}
                    variant="filled"
                    fullWidth
                    onChange={(e) => setEmail(`${(e.target as HTMLInputElement).value}`)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextValidator
                    type={showPassword ? 'text' : 'password'}
                    disabled={disabled}
                    name="password"
                    label="Password"
                    value={password}
                    variant="filled"
                    fullWidth
                    onChange={(e) => setPassword(`${(e.target as HTMLInputElement).value}`)}
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
                </Grid>
                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disabled={disabled}
                      disableToolbar
                      variant="inline"
                      format="yyyy-MM-dd"
                      id="dateOfBirth"
                      inputVariant='filled'
                      label="Date Of Birth"
                      value={dateOfBirth}
                      fullWidth
                      onChange={(date: Date | null) => { setDateOfBirth(date) }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      // error={Boolean(errorDateOfBirth)}
                      // helperText={` ${errorDateOfBirth}`}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    className={styles.button}
                    type='submit'
                    variant='contained'
                    color='primary'
                    disabled={disabled}
                    startIcon={<SaveIcon/>}
                  >
                    Save
                  </Button>
                  <Button
                    className={styles.button}
                    variant='contained'
                    color='default'
                    startIcon={ disabled ? <EditIcon/> : <HistoryIcon/> }
                    onClick={() => { handleReset(); setDisabled(!disabled) }}
                  >
                    { disabled ? 'Edit' : 'Reset' }
                  </Button>
                  {
                    user.admin
                      ? (
                      <Button
                        className={styles.button}
                        type='submit'
                        variant='contained'
                        color='secondary'
                        startIcon={<DeleteIcon/>}
                      >
                        Delete
                      </Button>
                        )
                      : (<></>)
                  }
                </Grid>
              </Grid>
            </ValidatorForm>
          </Box>
        </>)
      case 'Buy': {
        return (<>
          <h1>Buy</h1>
        </>)
      }
      case 'Won Games': {
        return (<>
          <h1>Won Games</h1>
        </>)
      }
      case 'Purchased Games': {
        return (<>
          <h1>Purchased Games</h1>
        </>)
      }
      case 'Admin': {
        return (<>
          <h1>Admin</h1>
        </>)
      }
      default:
        return (<>
          <h1>Error</h1>
        </>)
    }
  }

  if (!loadingUser && user) {
    return (
    <>
      <Head>
        <title>{(user.nickname as String).toUpperCase()} - BinGoal</title>
      </Head>
      <main className={styles.main}>
        <Drawer
          variant="permanent"
          open
          className={styles.drawer}
          classes={{
            paper: styles.drawerPaper
          }}
        >
          <Toolbar />

          <div>
            <List className={styles.list}>
              <ListItem button onClick={() => setContainer('Profile')}>
                <ListItemIcon>
                  <PersonIcon/>
                </ListItemIcon>
                <ListItemText primary='Profile'/>
              </ListItem>
              <ListItem button onClick={() => setContainer('Buy')}>
                <ListItemIcon>
                  <MonetizationOnIcon/>
                </ListItemIcon>
                <ListItemText primary='Buy'/>
              </ListItem>
              <ListItem button onClick={() => setContainer('Won Games')}>
                <ListItemIcon>
                  <GradeIcon/>
                </ListItemIcon>
                <ListItemText primary='Won Games'/>
              </ListItem>
              <ListItem button onClick={() => setContainer('Purchased Games')}>
                <ListItemIcon>
                  <HistoryIcon/>
                </ListItemIcon>
                <ListItemText primary='Purchased Games'/>
              </ListItem>
            </List>
            {
              user.admin
                ? (<>
                  <Divider/>
                  <List className={styles.list}>
                    <ListItem button onClick={() => setContainer('Admin')}>
                      <ListItemIcon>
                        <SupervisorAccountIcon/>
                      </ListItemIcon>
                      <ListItemText primary='Admin'/>
                    </ListItem>
                  </List>
                </>)
                : (<></>)
            }
          </div>

        </Drawer>
        <div className={styles.container}>
          {
            switchContainer()
          }
        </div>
      </main>
    </>
    )
  } else {
    return (
      <>
        <Head>
          <title>LOADING - BinGoal</title>
        </Head>
        <CircularProgress />
      </>
    )
  }
}
