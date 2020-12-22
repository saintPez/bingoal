import { memo, useContext, useState, MouseEvent, useEffect } from 'react'
import Axios from 'axios'
// import Image from 'next/image'
import Link from 'next/link'
import userContext from 'context/userContext'
import styles from 'styles/Header.module.scss'
import { Button, Typography, Toolbar, AppBar, Avatar, MenuItem, IconButton, Menu } from '@material-ui/core'

export default memo(function Nav () {
  const { setUser, user, setToken, token } = useContext(userContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    const loadUser = async () => {
      if (!localStorage.getItem('BINGOAL_TOKEN')) return
      try {
        const { data } = await Axios.get('api/profile/me', {
          headers: {
            token: `${localStorage.getItem('BINGOAL_TOKEN')}`
          },
          data: {}
        })
        setUser(data.data)
        setToken(localStorage.getItem('BINGOAL_TOKEN'))
      } catch (error) {
        setUser(false)
        setToken(false)
        console.log(token)
      }
    }
    loadUser()
  }, [])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="sticky" color='default'>
      <Toolbar className={styles.header}>
        <Typography variant="h6" className={styles.title}>
          <Link href="/">
            BinGoal
          </Link>
        </Typography>
        <Link href="/faq">
          <Button>Faq</Button>
        </Link>
        <Link href="/play">
          <Button>Play</Button>
        </Link>
        {
        !user
          ? (<>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </>)
          : (
            <>
              <IconButton
                aria-controls='menu-profile'
                aria-haspopup="true"
                onClick={handleClick}
              >
                <Avatar>{`${user.firstname.substr(0, 1)}${user.lastname.substr(0, 1)}`}</Avatar>
              </IconButton>
              <Menu
                id="menu-profile"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
              >
                <Link href='/profile/me'>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
                <Link href='/logout'>
                  <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Link>
              </Menu>
            </>
            )
        }
      </Toolbar>
    </AppBar>
    // <header className={styles.header}>
    //   <Link href="/">
    //     <a>BinGoal</a>
    //   </Link>
    //   <nav>
    //     <Link href="/">
    //       <a>Home</a>
    //     </Link>
    //     <Link href="/faq">
    //       <a>Faq</a>
    //     </Link>
    //     <Link href="/play">
    //       <a>Play</a>
    //     </Link>
    //     {!jwt
    //       ? (
    //         <>
    //           <Link href="/login">
    //             <a>Login</a>
    //           </Link>
    //           <Link href="/register">
    //             <a>Register</a>
    //           </Link>
    //         </>
    //         )
    //       : (
    //           <button className={styles.profile}>
    //             <Image src="/profile.jpg" width={28} height={28} />
    //             <span className={styles.username}>ThePez</span>
    //             <ul className={styles.ul}>
    //               <li>
    //                 <Link href="/profile/me">
    //                   <a>
    //                     <Image src="/profile.jpg" width={28} height={28} />
    //                     <span>Santiago Lopez</span>
    //                   </a>
    //                 </Link>
    //               </li>
    //               <li>
    //                 <Link href="/logout">
    //                   <a>Salir</a>
    //                 </Link>
    //               </li>
    //             </ul>
    //           </button>
    //         )}
    //   </nav>
    // </header>
  )
})

/*
import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from 'styles/Header.module.scss';

export default memo(function Nav() {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        router.push("/profile/me")
    };

    return (
        <header className={styles.header}>
            <Link href="/">
                <a>Bingo</a>
            </Link>
            <nav>
                <Link href="/">
                    <a>Home</a>
                </Link>
                <Link href="/faq">
                    <a>Faq</a>
                </Link>
                <Link href="/play">
                    <a>Play</a>
                </Link>
                <button className={styles.profile}>
                    <Image src="/profile.jpg" width={28} height={28} />
                    <span className={styles.username}>ThePez</span>
                    <ul id="ul" className={styles.active}>
                        <li>
                            <a onClick={handleClick}>
                                <Image
                                    src="/profile.jpg"
                                    width={28}
                                    height={28}
                                />
                                <span>Santiago Lopez</span>
                            </a>
                        </li>
                        <li>
                            <a>Salir</a>
                        </li>
                    </ul>
                </button>
            </nav>
        </header>
    );
});
*/
