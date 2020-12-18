import { memo, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import userContext from 'context/userContext'
import styles from 'styles/Header.module.scss'

export default memo(function Nav () {
  const { jwt } = useContext(userContext)

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
        {!jwt
          ? (
            <>
              <Link href="/login">
                <a>Login</a>
              </Link>
              <Link href="/register">
                <a>Register</a>
              </Link>
            </>
            )
          : (
              <button className={styles.profile}>
                <Image src="/profile.jpg" width={28} height={28} />
                <span className={styles.username}>ThePez</span>
                <ul className={styles.ul}>
                  <li>
                    <Link href="/profile/me">
                      <a>
                        <Image src="/profile.jpg" width={28} height={28} />
                        <span>Santiago Lopez</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/logout">
                      <a>Salir</a>
                    </Link>
                  </li>
                </ul>
              </button>
            )}
      </nav>
    </header>
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
