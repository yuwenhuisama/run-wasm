import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import Footer from './Footer'

export const WEBSITE_HOST_URL = 'https://www.microsoft.com/en-us/edge'

export default function Layout({ children }) {
  const router = useRouter()

  const siteName = 'Edge Code Playground'
  // const twitterHandle = '@SlipApp'
  // const previewImage = `${WEBSITE_HOST_URL}/og-image.png`
  // const currentUrl = `${WEBSITE_HOST_URL}${router.asPath}`
  const description =
    'Edge Code Playground is a place where you can execute code based on WASM runtime in <b>Edge</b> browser.'
  const pageTitle = 'Edge Code Playground'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        {/* <link rel="icon" href="/favicon.ico" /> */}

        {/* Twitter */}
        {/* <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content={twitterHandle} key="twhandle" /> */}

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} key="ogtitle" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:url" content={currentUrl} key="ogurl" />
        <meta property="og:image" content={previewImage} key="ogimage" /> */}
        <meta property="og:site_name" content={siteName} key="ogsitename" />
        <meta property="og:description" content={description} key="ogdesc" />
      </Head>
      {children}
      <Footer />
    </>
  )
}
