import { useContext, useEffect, useState } from 'react'
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

import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import PersonIcon from '@material-ui/icons/Person'
import GradeIcon from '@material-ui/icons/Grade'
import HistoryIcon from '@material-ui/icons/History'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'

export default function Me () {
  const { user, loadingUser } = useContext(userContext)
  const [container, setContainer] = useState('Profile')

  useEffect(() => {
    if (!loadingUser && !user) Router.push('/')
  }, [loadingUser])

  const switchContainer = () => {
    switch (container) {
      case 'Profile':
        return (<>
          <h1>Profile</h1>
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
