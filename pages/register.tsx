import Head from 'next/head'
import FormRegister from 'components/formRegister'

export default function Register () {
  return (
    <>
      <Head>
        <title>REGISTER - BinGoal</title>
      </Head>
      <main>
        <FormRegister/>
      </main>
    </>
  )
}
