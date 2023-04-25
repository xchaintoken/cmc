const { createSecureHeaders } = require('next-secure-headers')

module.exports = {
  headers: () => {
    return [
      {
        source: '/(.*)',
        headers: createSecureHeaders(),
      },
    ]
  },
  images: {
    loader: 'imgix',
    path: '',
  },
}