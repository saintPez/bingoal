import { useContext } from 'react'
// import Axios from 'axios'
import userContext from 'context/userContext'
// import styles from 'styles/drashboard/WonGames.module.scss'

import InfoGame from 'components/infoGame'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import { IGame } from 'models/Game'

export default function WonGames () {
  const { user } = useContext(userContext)
  return (
    <>
      { !user.wonGames.length
        ? (
          <Typography component='h1' variant='body1'>Won Games not found</Typography>
          )
        : (
          <Grid container spacing={3}>
            {
              (user.wonGames as Array<IGame>).map((game) => (
                <Grid key={`${game}`} item xs={12} md={6} lg={4}>
                  <InfoGame id={`${game}`} won={true}/>
                </Grid>
              ))
            }
          </Grid>
          )
      }
    </>
  )
}
