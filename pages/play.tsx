import { useContext, useEffect, useState } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import Axios from 'axios'

import userContext from 'context/userContext'

import PlayCard from 'components/playCard'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import { IGame } from 'models/Game'
import { IUser } from 'models/User'

export default function Play () {
  const { user, loadingUser } = useContext(userContext)
  const [games, setGames] = useState<IGame[] | false>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!loadingUser && !user) Router.push('/')
    const loadGames = async () => {
      try {
        const newGames: IGame[] | false = games || []
        for (const purchasedGame of (user as IUser).purchasedGames) {
          const { data } = await Axios.get(`/api/game/${purchasedGame}`, {
            headers: {
              token: `${localStorage.getItem('BINGOAL_TOKEN')}`
            },
            data: {}
          })
          if (data.data.playing) newGames.push(data.data as IGame)
        }
        setGames(newGames)
      } catch (error) {
        setGames(games)
      }
    }
    loadGames()
    setLoading(false)
  }, [loadingUser])

  if (!loadingUser && user && !loading && games) {
    return (
    <>
      <Head>
        <title>PLAY - BinGoal</title>
      </Head>
      <main>
        {
          games.map((game) => {
            const purchasedCards = game.purchasedCards.filter((purchasedCard) => purchasedCard.user === user._id)
            return purchasedCards.map((purhcasedCard) => (
              <PlayCard key={purhcasedCard._id} data={purhcasedCard} game={game._id}/>
            ))
          })
        }
      </main>
    </>
    )
  } else if (!loadingUser && user && !loading) {
    return (
      <>
        <Head>
          <title>PLAY - BinGoal</title>
        </Head>
        <main>
          <Typography component='h1' variant='h1'>games not found</Typography>
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
