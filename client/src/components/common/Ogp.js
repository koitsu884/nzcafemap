import React from 'react'
import Helmet from 'react-helmet'

export default function Ogp({isRoot, title, url, description, image}) {
  const type = isRoot ? 'website' : 'article';

  return(
    <Helmet>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={"ニュージーランドカフェマップ"} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary" />
    </Helmet>
  )
}