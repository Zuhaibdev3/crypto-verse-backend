// import { injectable } from "inversify";
import { FilterQuery, Model, Schema } from "mongoose"
import IRepository from './irepository';
import { injectable } from "inversify";
import { DatabaseId } from "../../types";

@injectable()
export default abstract class Repository<T> implements IRepository<T> {
  /**
   * @description Create an instance of the MongooseService class
   * @param Model {mongoose.model} Mongoose Model to use for the instance
   */
  abstract model: Model<T>
  constructor() {
  }

  /**
   * @description Create a new document on the Model
   * @param pipeline {array} Aggregate pipeline to execute
   * @returns {Promise} Returns the results of the query
   */
  aggregate(pipeline: Array<any>) {
    return this.model.aggregate(pipeline).exec();
  }

  /**
   * @description Create a new document on the Model
   * @param body {object} Body object to create the new document with
   * @returns {Promise} Returns the results of the query
   */
  create(body: T): Promise<T> {
    return this.model.create(body);
  }

  async createWithLean(body: T): Promise<T> {
    const createdDocument = await this.model.create(body);
    return createdDocument.toObject();
  }

  /**
   * @description Create multiple documents on the Model
   * @param body {array} Body array to create new documents with
   * @returns {Promise} Returns the results of the query {acknowledged: boolean;  insertedIds: string[]}
   */
  insertMany(body: T[]): Promise<any> {
    return this.model.insertMany(body);
  }

  /**
   * @description Count the number of documents matching the query criteria
   * @param query {object} Query to be performed on the Model
   * @returns {Promise} Returns the results of the query
   */
  count(query: object) : Promise<number> {
    return this.model.count(query).exec();
  }

  /**
   * @description Delete an existing document on the Model
   * @param id {string} ID for the object to delete
   * @returns {Promise} Returns the results of the query
   */
  delete(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }

  /**
   * @description Delete an existing document on the Model
   * @param ids {Array<string>} Ids for the object to delete
   */
  bulkDelete(ids: string[]) {
    return this.model.deleteMany({ _id: { $in: ids } }).exec();
  }

  /**
   * @description Delete an existing document on the Model
   * @param id {string} ID for the object to delete
   * @returns {Promise} Returns the results of the query
   */
  remove(query: any) {
    return this.model.remove(query).exec();
  }

  /**
   * @description Retrieve distinct "fields" which are in the provided status
   * @param query {object} Object that maps to the status to retrieve docs for
   * @param field {string} The distinct field to retrieve
   * @returns {Promise} Returns the results of the query
   */
  findDistinct(query: object, field: string): Promise<any> {
    return this.model
      .find(query)
      .distinct(field)
      .exec();
  }

  /**
   * @description Retrieve a single document from the Model with the provided
   *   query
   * @param query {object} Query to be performed on the Model
   * @param {object} [projection] Optional: Fields to return or not return from
   * query
   * @param {object} [options] Optional options to provide query
   * @returns {Promise} Returns the results of the query
   */
  findOne(query: FilterQuery<T> | undefined, projection = { __v: 0 }, options = { lean: true }) {
    return this.model
      .findOne(query, projection, options)
      .select({ __v: 0 })
      .exec();
  }


  /**
   * @description Retrieve multiple documents from the Model with the provided
   *   query
   * @param query {object} - Query to be performed on the Model
   * @param {object} [projection] Optional: Fields to return or not return from
   * query
   * @param {object} [sort] - Optional argument to sort data
   * @param {object} [options] Optional options to provide query
   * @returns {Promise} Returns the results of the query
   */
  find(query: any, projection = { __v: 0 }, sort = '', options = { lean: true }) {
    return this.model
      .find(query, projection, options)
      .sort(sort || { createdAt: -1 })
      .select({ __v: 0 })
      .exec()
  }
  /**
   * @description Retrieve a single document matching the provided ID, from the
   *   Model
   * @param id {string} Required: ID for the object to retrieve
   * @param {object} [projection] Optional: Fields to return or not return from
   * query
   * @param {object} [options] Optional: options to provide query
   * @returns {Promise} Returns the results of the query
   */
  findById(id: string, projection = { __v: 0 }, options = { lean: true }) : Promise<T | null> {
    return this.model
      .findById(id, projection, options)
      .exec();
  }

  /**
   * @description Update a document matching the provided ID, with the body and return the updated document
   * @param id {string} ID for the document to update
   * @param body {object} Body to update the document with
   * @param {object} [options] Optional options to provide query
   * @returns {Promise} Returns the results of the query
   */
  findByIdAndUpdate(id: DatabaseId | string, body: object, options = { lean: true, new: true }) : Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, body, options)
      .exec();
  }

  /**
   * @description Update one document matched with the query, with the body
   * @param id {string} ID for the document to update
   * @param body {object} Body to update the document with
   * @param {object} [options] Optional options to provide query
   * @returns {Promise} Returns the results of the query
   */
  updateOne(query: object, body: object, options = { new: true, returnOriginal: false}) {
    return this.model
      .updateOne(query, body, options)
      .exec();
  }

  /**
   * @description Update multiple documents matched with the the query, with the body
   * @param id {string} ID for the document to update
   * @param body {object} Body to update the document with
   * @param {object} [options] Optional options to provide query
   * @returns {Promise} Returns the results of the query
   */
  updateMany(query: object, body: object, options = {}) {
    return this.model
      .updateMany(query, body, options)
      .exec();
  }

  /**
   * @description Update one document matched with the query, with the body
   * @param id DatabaseId ID for the document to update
   * @param body {object} Body to update the document with
   * @param {object} [options] Optional options to provide query
   * @returns {Promise} Returns the results of the query
   */
  updateById(id: DatabaseId | string, body: object, options = {}) {
    return this.model
      .updateOne({ _id: id }, body, options)
      .exec();
  }

  findAllWithPopulate(query: any, populate: string, projection = { __v: 0 }, sort = '', options = { lean: true }, limit: number) {
    return this.model
      .find(query, projection, options)
      .populate(populate)
      .limit(limit)
      .sort(sort)
      .select({ __v: 0 })
      .exec()
  }
  findAllWithPopulateAndPagination(query: any, populate: string, page: number, limit: number, projection = { __v: 0 }, sort = '', options = { lean: true }) {
    return this.model
      .find(query, projection, options)
      .populate(populate)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort || { createdAt: -1 })
      .select({ __v: 0 })
      .exec()
  }
  findAllWithPagination(query: any, page: number, limit: number, projection = { __v: 0 }, sort = '', options = { lean: true }) : Promise<T[]> {
    return this.model
      .find(query, projection, options)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort || { createdAt: -1 })
      .select({ __v: 0 })
      .exec()
  }
  findOneWithPopulate(query: any, populate: string, projection = { __v: 0 }, sort = '', options = { lean: true }) {
    return this.model
      .findOne(query, projection, options)
      .populate(populate)
      .sort(sort)
      .select({ __v: 0 })
      .exec()
  }

  async findByNameAndBusinessId(name: string, businessId: DatabaseId, page: number, limit: number, searchWith: string, select: string): Promise<any> {
    const skipAmount = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.find({
        "$expr": {
          "$regexMatch": {
            "input": { "$concat": [{ "$toString": `$${searchWith}` }] },
            "regex": `${name}`,
            "options": "i"
          }
        },
        "business": businessId
      })
        .select(`${select}`)
        .sort({ createdAt: -1 })
        .skip(skipAmount)
        .limit(limit),

      this.model.countDocuments({
        "$expr": {
          "$regexMatch": {
            "input": { "$concat": [{ "$toString": `$${searchWith}` }] },
            "regex": `${name}`,
            "options": "i"
          }
        },
        "business": businessId
      })
    ]);

    return {
      data,
      total
    };
  }


}