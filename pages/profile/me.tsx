import { useContext, useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'

import userContext from 'context/userContext'
import Profile from 'components/profile'

import CircularProgress from '@material-ui/core/CircularProgress'

export default function Me () {
  const { user, loadingUser } = useContext(userContext)

  useEffect(() => {
    if (!loadingUser && !user) Router.push('/')
  }, [loadingUser])

  if (!loadingUser && user) {
    return (
      <>
        <Head>
          <title>{`${user.nickname}#${user.hash} - BinGoal`}</title>
        </Head>
        <Profile id={user._id}/>
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
