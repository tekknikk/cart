const chai = require('chai')
import { app } from '../../server'
import { logger } from '../../utils/logger'
import { Product } from '../../app/models/product'
import { config } from '../../config/env'

const expect = chai.expect
const assert = chai.assert
const request = require('supertest')
const data = require('../data/01')

before(() => {
  Product.remove({}, () => {
    logger.trace('Test db: Product collection removed!')
  });
});

describe('API for Products', () => {

  describe('POST /products', () => {
    it('[STEP01.1] should successfully create a product with quantity of 5', function() {
      return request(app)
        .post('/products')
        .send(data.product)
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res: any) => {
          console.log('products test: ', res.body)
          expect(res.body.name).to.equal('Dove Soap')
          expect(res.body.quantity).to.equal(data.product.quantity)
          expect(res.body.price).to.equal(data.product.price)
        });
    });
  });

  describe('GET /products', () => {
    it('[STEP01.2] should successfully return a list of products grouped by customer', function() {
      return request(app)
        .get('/products')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res: any) => {
          console.log('products test: ', res.body[0])
          expect(res.body).to.be.not.empty
          expect(res.body).length.to.have.length.greaterThan(0)
          expect(res.body[0].total).to.equal(data.result.total)
        });
    });
  });
});
