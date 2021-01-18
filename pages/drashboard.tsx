import { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import userContext from 'context/userContext'
import styles from 'styles/Drashboard.module.scss'

import Profile from 'components/drashboard/profile'
import Buy from 'components/drashboard/buy'
import WonGames from 'components/drashboard/wonGames'
import PurchasedGames from 'components/drashboard/purchasedGames'
import Admin from 'components/drashboard/admin'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import CircularProgress from '@material-ui/core/CircularProgress'
import Toolbar from '@material-ui/core/Toolbar'

import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import PersonIcon from '@material-ui/icons/Person'
import GradeIcon from '@material-ui/icons/Grade'
import HistoryIcon from '@material-ui/icons/History'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'

export default function Me () {
  const { user, loadingUser } = useContext(userContext)
  const [container, setContainer] = useState('Profile')

  // const [errorNickname, setErrorNickname] = useState('')
  // const [errorFirstname, setErrorFirstname] = useState('')
  // const [errorLastname, setErrorLastname] = useState('')
  // const [errorEmail, setErrorEmail] = useState('')
  // const [errorPassword, setErrorPassword] = useState('')
  // const [errorDateOfBirth, setErrorDateOfBirth] = useState('')

  useEffect(() => {
    if (!loadingUser && !user) Router.push('/')
  }, [loadingUser])

  const switchContainer = () => {
    switch (container) {
      case 'Profile': {
        return <Profile/>
      }
      case 'Buy': {
        return <Buy/>
      }
      case 'Won Games': {
        return <WonGames/>
      }
      case 'Purchased Games': {
        return <PurchasedGames/>
      }
      case 'Admin': {
        return <Admin/>
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
        <title>DRASHBOARD - BinGoal</title>
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
