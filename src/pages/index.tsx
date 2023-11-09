import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Controls } from '@/components/Controls'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Robot Controls</title>
        <meta name="description" content="Robot Controls" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <Controls />
      </main>
    </>
  )
}
