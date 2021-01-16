import { useContext, useEffect } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Router from 'next/router'

import userContext from 'context/userContext'
import Game from 'components/game'

import CircularProgress from '@material-ui/core/CircularProgress'

export default function GameId ({ id }) {
  const { user, loadingUser } = useContext(userContext)

  useEffect(() => {
    if (!loadingUser && !user) Router.push('/')
  }, [loadingUser])

  if (!loadingUser && user && !Router.isFallback) {
    return (
      <>
        <Head>
          <title>{`Game#${id} - BinGoal`}</title>
        </Head>
        <Game id={`${id}`} user={user._id}/>
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = `${params.id}`
  return {
    props: { id }
  }
}
