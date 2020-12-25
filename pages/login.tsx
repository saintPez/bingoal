import { useContext, useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import userContext from 'context/userContext'
import FormLogin from 'components/formLogin'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function Login () {
  const { user, loadingUser } = useContext(userContext)

  useEffect(() => {
    if (!loadingUser && user) Router.push('/')
  }, [loadingUser])

  if (!loadingUser && !user) {
    return (
    <>
      <Head>
        <title>LOGIN - BinGoal</title>
      </Head>
      <main>
        <FormLogin/>
      </main>
    </>
    )
  } else {
    return (
      <>
        <Head>
          <title>LOADING - BinGoal</title>
        </Head>
        <main>
          <CircularProgress />
        </main>
      </>
    )
  }
}
