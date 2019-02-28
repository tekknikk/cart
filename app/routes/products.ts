import * as restify from 'restify'
import * as offers from '../controllers/products'

export default (api: restify.Server) => {

  api.post('/products', offers.create)
  api.get('/products', offers.list)

}
