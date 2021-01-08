import { useEffect, useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Axios from 'axios'
import styles from 'styles/components/Profile.module.scss'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

interface IUser {
  _id: string,
  nickname: string,
  hash: string,
  firstname: string,
  lastname: string,
  email: string,
  dateOfBirth: Date
}

export default function Profile ({ id }) {
  const [user, setUser] = useState<IUser | false>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await Axios.get(`/api/profile/${id}`, {
          headers: {
            token: `${localStorage.getItem('BINGOAL_TOKEN')}`
          },
          data: {}
        })
        setUser(data.data)
      } catch (error) {
        console.log(error)
        setUser(false)
        setTimeout(() => {
          Router.push('/')
        }, 3000)
      }
    }
    loadUser()
    setLoading(false)
  }, [])

  if (!loading && user) {
    return (
      <>
        <Head>
            <title>{`${user.nickname}#${user.hash} - BinGoal`}</title>
        </Head>
        <Box boxShadow={5} borderRadius={10} className={styles.box} component='main'>
          <Typography component='span' variant='h5'>{`${user._id}`}</Typography>
          <Typography component='h1' variant='h5'>{`${user.nickname}#${user.hash}`}</Typography>
          <Typography component='h2' variant='h5'>{`${user.firstname} ${user.lastname}`}</Typography>
          <Typography component='h2' variant='h5'>{`${user.email}`}</Typography>
          <Typography component='h2' variant='h5'>{`${user.dateOfBirth}`}</Typography>
        </Box>
      </>
    )
  } else if (loading) {
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
          <title>User not found - BinGoal</title>
        </Head>
        <Typography component='h1' variant='h3'>User not found</Typography>
      </>
    )
  }
}
