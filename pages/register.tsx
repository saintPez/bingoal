import { useContext, useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import userContext from 'context/userContext'
import FormRegister from 'components/formRegister'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function Register () {
  const { user, loadingUser } = useContext(userContext)

  useEffect(() => {
    if (!loadingUser && user) Router.push('/')
  }, [loadingUser])

  if (!loadingUser && !user) {
    return (
    <>
      <Head>
        <title>REGISTER - BinGoal</title>
      </Head>
      <main>
        <FormRegister/>
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
