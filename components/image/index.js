import Image from 'next/image'

const loader = (
  {
    src,
    width,
    quality = 75,
  },
) =>
  `${
    process.env.NEXT_PUBLIC_IMAGE_OPTIMIZER_URL ?
      `${process.env.NEXT_PUBLIC_IMAGE_OPTIMIZER_URL}/_next` :
      ''
  }${
    src?.startsWith('/') ?
      '' :
      '/'
  }${src}${
    process.env.NEXT_PUBLIC_IMAGE_OPTIMIZER_URL ?
      `?url=${
        src?.startsWith('/') ?
          process.env.NEXT_PUBLIC_SITE_URL :
          ''
      }${src}&w=${width}&q=${quality}` :
      ''
  }`

export default (
  {
    src = '',
    ...rest
  }
) => {
  return (
    src
      .includes(
        'assets.coingecko.com'
      ) ?
      <img
        src={src}
        { ...rest }
      /> :
      <Image
        { ...rest }
        loader={loader}
      />
  )
}