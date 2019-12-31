const keySecret = 'privateKey'
const jwt = require('jsonwebtoken')
function loginUser (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, keySecret, function(err, decoded) {
      if (err) {
        reject(err)
      }
      resolve(decoded)
    })
  })
}

export default loginUser
