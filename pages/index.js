import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Calendarium</title>
        <meta name="Calendarium" content="Calendar of exams" />
        <link rel="icon" href="/cesium.ico" />
      </Head>

      <div className={styles.main}>
        <img src='/cesium-full-logo.png'/>
      </div>

    </div>
  )
}
