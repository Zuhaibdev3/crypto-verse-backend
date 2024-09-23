import Category, { CategoryModel } from '../model/Category';
import { NoDataError } from '../../core/ApiError';

export default class BucketRepo {

  public static find(): Promise<Category[]> {
    return CategoryModel
      .find({ isDeleted: false })
      .select("-isDeleted -updatedAt")
      .lean<Category[]>()
      .exec();
  }

  public static async create(body: Category): Promise<{ bucket: Category }> {    
    const bucket = await CategoryModel.create({ ...body } as Category);
    return { bucket };
  }

  public static async delete(key: string): Promise<{ bucket: any }> {
    const bucket = await CategoryModel.findOneAndDelete({ key });
    if (!bucket) throw new NoDataError();
    return { bucket };
  }

}
