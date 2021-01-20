import { useContext, useEffect, useState } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import Axios from 'axios'

import userContext from 'context/userContext'

import PlayCard from 'components/playCard'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import { ICard } from 'models/Card'
import { IUser } from 'models/User'

export default function Play () {
  const { user, loadingUser } = useContext(userContext)
  const [cards, setCards] = useState<ICard[] | false>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!loadingUser && !user) Router.push('/')
    const loadGames = async () => {
      try {
        const newCards: ICard[] | false = cards || []
        for (const purchasedGame of (user as IUser).purchasedGames) {
          const { data } = await Axios.get(`/api/game/${purchasedGame}`, {
            headers: {
              token: `${localStorage.getItem('BINGOAL_TOKEN')}`
            },
            data: {}
          })
          if (data.data.playing) newCards.push(data.data as ICard)
        }
        setCards(newCards)
      } catch (error) {
        setCards(cards)
      }
    }
    loadGames()
    setLoading(false)
  }, [loadingUser])

  if (!loadingUser && user && !loading && cards) {
    return (
    <>
      <Head>
        <title>PLAY - BinGoal</title>
      </Head>
      <main>
        {
          cards.map((card) => (
            <PlayCard key={card._id} data={card}/>
          ))
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
          <Typography component='h1' variant='h1'>Cards not found</Typography>
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
