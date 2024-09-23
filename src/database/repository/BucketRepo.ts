import Bucket, { BucketModel } from '../model/Bucket';
import { NoDataError } from '../../core/ApiError';

export default class BucketRepo {

  public static find(): Promise<Bucket[]> {
    return BucketModel
      .find({ isDeleted: false })
      .populate("category", "title")
      .select("-isDeleted -updatedAt")
      .lean<Bucket[]>()
      .exec();
  }

  public static findByBlog(): Promise<Bucket[]> {
    return BucketModel
      .find({ type: "Blog", isDeleted: false })
      .populate("category", "title")
      .select("-isDeleted -updatedAt")
      .lean<Bucket[]>()
      .exec();
  }

  public static findByBlogCategory(ids: string): any {
    const categoryIds = ids.split(',')
    return BucketModel
      .find({ type: "Blog", isDeleted: false, category: { $in: categoryIds } })
      .populate("category", "title")
      .select("-isDeleted -updatedAt")
      .lean<Bucket[]>()
      .exec();
  }

  public static findByNews(): Promise<Bucket[]> {
    return BucketModel
      .find({ type: "News", isDeleted: false })
      .populate("category", "title")
      .select("-isDeleted -updatedAt")
      .lean<Bucket[]>()
      .exec();
  }

  public static findByNewsCategory(id: string): Promise<Bucket[]> {
    return BucketModel
      .find({ type: "News", isDeleted: false, category: { $in: [id] } })
      .populate("category", "title")
      .select("-isDeleted -updatedAt")
      .lean<Bucket[]>()
      .exec();
  }

  public static findforKey(key: string): Promise<Bucket | null> {
    return BucketModel
      .findOne({ key, isDeleted: false })
      .populate("category", "title")
      .select("-isDeleted -updatedAt")
      .exec();
  }

  public static async create(body: Bucket): Promise<{ bucket: Bucket }> {
    const bucket = await BucketModel.create({ ...body } as Bucket);
    return { bucket };
  }

  public static async update(key: string, body: Bucket): Promise<{ bucket: Bucket }> {
    const bucket = await BucketModel.findOneAndUpdate({ key }, body, { new: true, runValidators: true });
    if (!bucket) throw new NoDataError();
    return { bucket };
  }

  public static async updatePublish(key: string, isPublic: Bucket): Promise<{ bucket: Bucket }> {
    const bucket = await BucketModel.findOneAndUpdate({ key }, { $set: { isPublic } }, { new: true, runValidators: true });
    if (!bucket) throw new NoDataError();
    return { bucket };
  }

  public static async delete(key: string): Promise<{ bucket: any }> {
    const bucket = await BucketModel.findOneAndDelete({ key });
    if (!bucket) throw new NoDataError();
    return { bucket };
  }

  // private async uploadFile(file: string, path: string): Promise<string> {
  //   AWS.config.update({
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_SECRET_KEY,
  //   });

  //   const S3 = new AWS.S3();
  //   const urlKey = `${Date.now().toString()}-${v4()}`;
  //   const params = {
  //     Body: file,
  //     Bucket: process.env.AWS_S3_BUCKET_NAME,
  //     Key: path + '/' + urlKey,
  //     ContentEncoding: 'base64',
  //     ContentType: 'image/jpeg',
  //   };
  //   const data = await S3.upload(params).promise();
  //   return data.Location;
  // }


}
