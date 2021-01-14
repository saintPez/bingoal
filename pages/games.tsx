import { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Axios from 'axios'

import styles from 'styles/games.module.scss'

import userContext from 'context/userContext'
import InfoGame from 'components/infoGame'

import { IGame } from 'models/Game'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

export default function GameId () {
  const { user, loadingUser } = useContext(userContext)
  const [games, setGames] = useState<IGame[] | false>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!loadingUser && !user) Router.push('/')
    const loadGames = async () => {
      try {
        const { data } = await Axios.get('/api/games', {
          headers: {
            token: `${localStorage.getItem('BINGOAL_TOKEN')}`
          },
          data: {}
        })
        setGames((data.data as IGame[]))
      } catch (error) {
        setGames(false)
      }
    }
    loadGames()
    setLoading(false)
  }, [loadingUser])

  if (!loadingUser && user && !Router.isFallback && !loading && games) {
    return (
      <>
        <Head>
          <title>Games - BinGoal</title>
        </Head>
        <main className={styles.main}>
          <Grid container spacing={3}>
            {
              (games as Array<IGame>).map((game) => (
                <Grid key={`${game._id}`} item xs={12} md={6} lg={4}>
                  <InfoGame data={game}/>
                </Grid>
              ))
            }
          </Grid>
        </main>
      </>
    )
  } else if (loading && !games) {
    return (
      <>
        <Head>
          <title>LOADING - BinGoal</title>
        </Head>
        <CircularProgress />
      </>
    )
  } else {
    return (
      <>
        <Head>
          <title>Games not found - BinGoal</title>
        </Head>
        <Typography component='h1' variant='body1'>Games not found</Typography>
      </>
    )
  }
}
