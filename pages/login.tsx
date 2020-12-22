import Head from 'next/head'
import FormLogin from 'components/formLogin'

export default function Login () {
  return (
    <>
      <Head>
        <title>LOGIN - BinGoal</title>
      </Head>
      <main>
        <FormLogin/>
      </main>
    </>
  )
}
