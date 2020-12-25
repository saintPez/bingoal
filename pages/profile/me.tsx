import { useContext, useEffect } from 'react'
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
import Avatar from '@material-ui/core/Avatar'
import CircularProgress from '@material-ui/core/CircularProgress'
import Toolbar from '@material-ui/core/Toolbar'

// import Typography from '@material-ui/core/Typography'
// import MoreVertIcon from '@material-ui/icons/MoreVert'
// import IconButton from '@material-ui/core/IconButton'
// import CardContent from '@material-ui/core/CardContent'
// import Card from '@material-ui/core/Card'
// import CardHeader from '@material-ui/core/CardHeader'

export default function Me () {
  const { user, loadingUser } = useContext(userContext)

  useEffect(() => {
    if (!loadingUser && !user) Router.push('/')
  }, [loadingUser])

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
              <ListItem button>
                <ListItemIcon>
                  <Avatar>{`${user.firstname.substr(0, 1)}${user.lastname.substr(0, 1)}`}</Avatar>
                </ListItemIcon>
                <ListItemText primary={`${user.nickname}#${user.hash}`}/>
              </ListItem>
            </List>
            <Divider/>
            <List className={styles.list}>
              <ListItem button>
                <ListItemIcon>
                  <Avatar>{`${user.firstname.substr(0, 1)}${user.lastname.substr(0, 1)}`}</Avatar>
                </ListItemIcon>
                <ListItemText primary={`${user.nickname}#${user.hash}`}/>
              </ListItem>
            </List>
          </div>

        </Drawer>
        <div className={styles.container}>
          {/* <Card raised>
            <CardHeader
              avatar={
                <Avatar>{`${user.firstname.substr(0, 1)}${user.lastname.substr(0, 1)}`}</Avatar>
              }
              title={`${user.firstname} ${user.lastname}`}
              subheader={`${user.nickname}#${user.hash}`}
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt odit architecto et expedita dolores perspiciatis sint. Magnam, et numquam accusantium maiores quia fuga aliquam, tenetur harum beatae voluptate doloremque quae!
              </Typography>
            </CardContent>
          </Card> */}
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum repellat facere eveniet esse sapiente nobis, beatae officia dicta ullam nostrum voluptas tenetur harum ipsam odit sunt, vitae numquam, incidunt dolor.</p>
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
