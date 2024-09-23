import { Schema } from "mongoose"
import { DatabaseId } from "../../types"

/**
 * Interface Base Repository
 */
export default interface IRepository<T> {

  /**
   * @description Aggregation
   * @param pipeline 
   */
  aggregate(pipeline: Array<any>): Promise<any>

  /**
   * @description insert data in table
   * @param body {object} Body object to create the new document with
   */
  create(body: T): Promise<T>

  createWithLean(body: T): Promise<T>

  /**
   * @description insert multiple data in table
   * @param body {array} Body object to create the new document with
   */
  insertMany(body: T[]): Promise<any>

  /**
     * @description Count the number of documents matching the query criteria
     * @param query {object} Query to be performed on the Model
     * @returns {Promise} Returns the results of the query
     */
  count(query: object): Promise<number>

  /**
   * @description Delete an existing document on the Model
   * @param id {String} Id for the object to delete
   */
  delete(id: string): Promise<any>

  /**
   * @description Delete an existing document on the Model
   * @param ids {Array<string>} Ids for the object to delete
   */
  bulkDelete(ids: string[]): Promise<any>

  /**
   * @description Delete an existing document on the Model
   * @param id {String} Id for the object to delete
   */
  remove(query: any): Promise<any>

  /**
   * @description Retrieve distinct "fields" which are in the provided status
   * @param query {Object} for tbe Select In Table 
   * @param field {string} for Distint
   */
  findDistinct(query: Object, field: string): Promise<any>

  /**
   * @description Retrieve a single document from the Model with the provided
   *   query
   * @param query {object} Query to be performed on the Model
   * @param {object} [projection] Optional: Fields to return or not return from
   * query
   * @param {object} [options] Optional options to provide query     */
  findOne(query: Object, projection?: Object, options?: Object): Promise<any>

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
  find(query: any, projection?: Object, sort?: Object | string, options?: Object): Promise<any>

  /**
  * @description Retrieve a single document matching the provided ID, from the
  *   Model
  * @param id {string} Required: ID for the object to retrieve
  * @param {object} [projection] Optional: Fields to return or not return from
  * query
  * @param {object} [options] Optional: options to provide query
  * @returns {Promise} Returns the results of the query
  */
  findById(id: string, projection?: Object, options?: Object): Promise<T | null>

  /**
  * @description Update a document matching the provided ID, with the body
  * @param id {DatabaseId} ID for the document to update
  * @param body {object} Body to update the document with
  * @param {object} [options] Optional options to provide query
  * @returns {Promise} Returns the results of the query
  */
  updateById(id: DatabaseId | string, body: Object, options?: Object): Promise<any>


  /**
     * @description Update a document matching the provided ID, with the body and return the updated document
     * @param id {string} ID for the document to update
     * @param body {object} Body to update the document with
     * @param {object} [options] Optional options to provide query
     * @returns {Promise} Returns the results of the query
     */
  findByIdAndUpdate(id: DatabaseId | string, body: object, options?: Object): Promise<T | null>

  /**
   * @description Update one document matched with the query, with the body
   * @param id {string} ID for the document to update
   * @param body {object} Body to update the document with
   * @param {object} [options] Optional options to provide query
   * @returns {Promise} Returns the results of the query
   */
  updateOne(query: object, body: object, options?: Object): Promise<any>


  /**
   * @description Update multiple documents matched with the the query, with the body
   * @param id {string} ID for the document to update
   * @param body {object} Body to update the document with
   * @param {object} [options] Optional options to provide query
   * @returns {Promise} Returns the results of the query
   */
  updateMany(query: object, body: object, options?: Object): Promise<any>

  /**
 * @description Retrieve multiple documents from the Model with the provided
 *   query
 * @param query {object} - Query to be performed on the Model
 * @param {object} [projection] Optional: Fields to return or not return from
 * query
 * @param {object} [sort] - Optional argument to sort data
 * @param {object} [options] Optional options to provide query
 * @param {string} [populate] Required parameter to provide populate
 * @returns {Promise} Returns the results of the query
 * 
 */
  findAllWithPopulate(query: any, populate: string, projection?: Object, sort?: Object | string, options?: Object, limit?: number): Promise<any>
  /**
 * @description Retrieve multiple documents from the Model with the provided
 *   query
 * @param query {object} - Query to be performed on the Model
 * @param {object} [projection] Optional: Fields to return or not return from
 * query
 * @param {object} [sort] - Optional argument to sort data
 * @param {object} [options] Optional options to provide query
 * @param {string} [populate] Required parameter to provide populate
 * @returns {Promise} Returns the results of the query
 * 
 */
  findOneWithPopulate(query: any, populate: string, projection?: Object, sort?: Object | string, options?: Object): Promise<any>
  /**
* @description Retrieve multiple documents from the Model with the provided
*   query
* @param query {object} - Query to be performed on the Model
* @param {object} [projection] Optional: Fields to return or not return from
* query
* @param {object} [sort] - Optional argument to sort data
* @param {object} [options] Optional options to provide query
* @param {string} [populate] Required parameter to provide populate
* @param {number} [page] Required parameter to provide 
* @param {number} [limit] Required parameter to provide 
* @returns {Promise} Returns the results of the query
* 
*/
  findAllWithPopulateAndPagination(query: any, populate: string, page: number, limit: number, projection?: Object, sort?: Object | string, options?: Object): Promise<any>

  findAllWithPagination(query: any, page: number, limit: number, projection?: Object, sort?: Object | string, options?: Object): Promise<T[]>

}