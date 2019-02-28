import * as restify from 'restify'
import { Product, IProductDocument } from '../models/product'
import { logger } from '../../utils/logger'

const errors = require('restify-errors')

export { create, list }


/**
 * Create a new product, and return it.
 * @property {array} req.params
 * @returns {IProductDocument}
 */
function create(req: restify.Request, res: restify.Response, next: restify.Next): void {
  logger.trace('products.new.req.params:', req.params);

  Product.save(req.params)
  .then((product: IProductDocument) => {
    return res.json(200, product);
  })
  .catch((err: any) => {
    logger.trace('product.create.err: ', err);
    return next(new errors.BadRequestError({ error: err.message }));
  });
}


/**
* List all products
* @returns {Products Collection}
*/
function list(req: restify.Request, res: restify.Response, next: restify.Next): void {
  logger.trace('products.list.req.params:', req.params);

  Product.findAll()
    .then((products: IProductDocument[]) => {
      res.json(200, products);
      return next();
    })
    .catch(() => {
      return next(new errors.NotFoundError());
    });
}
