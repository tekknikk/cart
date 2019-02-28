import * as mongoose from 'mongoose'
const Schema = mongoose.Schema
const errors = require('restify-errors')
import { logger } from '../../utils/logger'

// Document interface
interface IProductDocument extends mongoose.Document {
  name: string
  description: string
  price: number
  quantity: number
  total: number
  status: String
  createdAt: Date
  modifiedAt: Date
}

// Model interface
interface IProductModel extends mongoose.Model<IProductDocument> {
  save(user: any): any
  findAll(): any
}

const ProductSchema = new Schema({
  customerId: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  }
})

ProductSchema.index({
  name: 'text',
})

// Static methods
ProductSchema.statics = {

  /**
  * Save an product.
  * @param {product} any
  * @returns {Promise<any>}
  */
  save: function (product: any): Promise<any> {
    const Product = this.model('Product')
    return new Product({
      customerId: product.customerId,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      total: Math.round((product.price * product.quantity) * 100 ) / 100,
      status: product.status,
    }).save()
  },

  /**
  * Get all products
  * @returns {Promise<any>}
  */
  findAll: function (): Promise<IProductDocument> {
    return this
      .aggregate([
        {
          $match: {
            status: 'New'
          }
        },
        {
          $group: {
            _id: "$customerId",
            total: {$sum: "$total"}
          }
        }
      ])
      .exec()
      .then((products: Array<IProductModel>) => {
        if (products && products.length) {
          return products
        }
        return Promise.reject(new errors.BadRequestError())
      })
  }

}

const Product: IProductModel = <IProductModel>mongoose.model('Product', ProductSchema)

export { Product, IProductDocument }
