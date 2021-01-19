import { useEffect, useState } from 'react'
import Router from 'next/router'
import Axios from 'axios'
import styles from 'styles/components/infoGame.module.scss'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import { IGame } from 'models/Game'

interface IProps {
  id?: string,
  won?: boolean,
  data?: IGame,
  admin?: boolean
}

export default function Game (props: IProps) {
  const [game, setGame] = useState<IGame | false>(props.data || false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadGame = async () => {
      try {
        if (!game && props.id) {
          const { data } = await Axios.get(`/api/play/${props.id}`, {
            headers: {
              token: `${localStorage.getItem('BINGOAL_TOKEN')}`
            },
            data: {}
          })
          setGame(data.data as IGame)
        }
      } catch (error) {
        setGame(false)
      }
    }
    loadGame()
    setLoading(false)
  }, [])

  const handleClickPlay = async () => {
    try {
      await Axios.put(`/api/play/${(game as IGame)._id}`, {}, {
        headers: {
          token: `${localStorage.getItem('BINGOAL_TOKEN')}`
        }
      })
      Router.reload()
    } catch (error) {
      Router.reload()
    }
  }

  const handleClickBall = async () => {
    try {
      await Axios.post(' /api/create/ball', {
        game: `${(game as IGame)._id}`
      }, {
        headers: {
          token: `${localStorage.getItem('BINGOAL_TOKEN')}`
        }
      })
      Router.reload()
    } catch (error) {
      Router.reload()
    }
  }

  if (!loading && game) {
    return (
      <Card className={props.won ? styles.won : ''} variant='outlined'>
        <CardActions className={styles.actions}>
          <Typography color="textSecondary">{`ID: ${game._id}`}</Typography>
          {!game.playing && !game.played && <Button size="small" onClick={handleClickPlay}>Play</Button>}
          {game.playing && !game.played && <Button size="small" onClick={handleClickBall}>Ball</Button>}
        </CardActions>
        <CardContent className={styles.content}>
          <div>
            <Typography variant="h5" component="h1">Game</Typography>
            <br/>
            {game.played && <Typography color="textSecondary">Played</Typography>}
            {game.playing && <Typography color="textSecondary">Playing</Typography>}
          </div>
          <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                disabled
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id={`createdAt#${game._id}`}
                label="Created at"
                value={new Date(game.createdAt)}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
                onChange={() => {}}
                inputVariant='standard'
              />
            </MuiPickersUtilsProvider>
            <br/>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                disabled
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id={`gameDate#${game._id}`}
                label="Game date"
                value={new Date(game.gameDate)}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
                onChange={() => {}}
                inputVariant='standard'
              />
            </MuiPickersUtilsProvider>
          </div>
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
