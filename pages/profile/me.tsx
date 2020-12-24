import { useContext, useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import userContext from 'context/userContext'
// import styles from 'styles/profile/me.module.scss'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import MoreVertIcon from '@material-ui/icons/MoreVert'

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
      <main>
        <Card raised>
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
        </Card>
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
