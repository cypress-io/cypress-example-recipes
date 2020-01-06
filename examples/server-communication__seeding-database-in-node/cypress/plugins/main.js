// We're able to import and re-use the same code we use in our app
import { seed } from '../../server/db'

export default (on) => {
  on('task', {
    'seed:db' (data) {
      return seed(data).then(() => {
        return data
      })
    },
  })
}
