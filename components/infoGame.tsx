import { useEffect, useState } from 'react'
import Link from 'next/link'
import Axios from 'axios'
import styles from 'styles/components/infoGame.module.scss'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import LaunchIcon from '@material-ui/icons/Launch'

import { IGame } from 'models/Game'

export default function Game ({ id, won }) {
  const [game, setGame] = useState<IGame | false>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadGame = async () => {
      try {
        const { data } = await Axios.get(`/api/game/${id}`, {
          headers: {
            token: `${localStorage.getItem('BINGOAL_TOKEN')}`
          },
          data: {}
        })
        setGame(data.data as IGame)
      } catch (error) {
        setGame(false)
      }
    }
    loadGame()
    setLoading(false)
  }, [])

  if (!loading && game) {
    return (
      <Card className={!won && styles.won} variant='outlined'>
        <CardActions className={styles.actions}>
          <Typography color="textSecondary">{`ID: ${game._id}`}</Typography>
          <Link href={`/game/${game._id}`}>
            <Button size="small" endIcon={<LaunchIcon/>}>Open</Button>
          </Link>
        </CardActions>
        <CardContent>
          <Typography variant="h5" component="h1">Game</Typography>
        </CardContent>
      </Card>
    )
  } else if (loading) {
    return (
      <CircularProgress />
    )
  } else {
    return (
      <Typography component='h1' variant='body1'>Game not found</Typography>
    )
  }
}
