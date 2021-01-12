import { useContext } from 'react'
// import Axios from 'axios'
import userContext from 'context/userContext'
// import styles from 'styles/drashboard/PurchasedGames.module.scss'

import InfoGame from 'components/infoGame'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { IGame } from 'models/Game'

export default function PurchasedGames () {
  const { user } = useContext(userContext)
  return (
    <>
      { !user.purchasedGames.length
        ? (
          <Typography component='h1' variant='body1'>Purchased Games not found</Typography>
          )
        : (
          <Grid container spacing={3}>
            {
              (user.purchasedGames as Array<IGame>).map((game) => (
                <Grid key={`${game}`} item xs={12} md={6} lg={4}>
                  <InfoGame id={game} won={!!user.wonGames.find((element) => element === game)}/>
                </Grid>
              ))
            }
          </Grid>
          )
      }
    </>
  )
}
