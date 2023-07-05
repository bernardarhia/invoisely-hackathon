import { Model, FilterQuery, PopulateOptions } from "mongoose";
import { formatModelPopulate, formatModelProjection } from "../helpers";

export interface IOptions {
  limit?: number;
  sort?: string;
  skip?: number;
}
interface PopulateOpt {
  [key: string]: string[];
}
export interface IService<T> {
  findOne(
    filter: FilterQuery<T>,
    projection?: {
      includes?: (keyof T)[];
      excludes?: (keyof T)[];
    },
    populate?: any,
    options?: IOptions,
  ): Promise<T | null>;
  findMany(filter?: any): Promise<T[]>;
  updateOne(filter: FilterQuery<T>, update: any): Promise<T | null>;
  updateMany(filter: FilterQuery<T>, update: any): Promise<void>;
}

export abstract class BaseService<T> implements IService<T> {
  protected readonly model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }
  async findOne(
    filter: FilterQuery<T>,
    projection?: {
      includes?: (keyof T)[];
      excludes?: (keyof T)[];
    },
    populate?: PopulateOpt,
    options?: IOptions,
  ): Promise<T | null> {
    let objectToProject = {};

    if (projection) {
      objectToProject = formatModelProjection<T>(
        projection.includes,
        projection.excludes,
      );
    }
    let query = this.model.findOne(filter, objectToProject);
    if (populate) {
      const populatedFields: PopulateOptions[] = formatModelPopulate(populate);
      query.populate(populatedFields);
    }
    if (options && options.limit) {
      query.limit(options.limit);
    }
    if (options && options.sort) {
      query.sort(options.sort);
    }
    const result = await query.exec();
    return result ? result.toObject() : result;
  }

  async findMany(
    filter: FilterQuery<T>,
    projection?: {
      includes?: (keyof T)[];
      excludes?: (keyof T)[];
    },
    populate?: PopulateOpt,
    options?: IOptions,
  ): Promise<T[]> {
    let objectToProject = {};

    if (projection) {
      objectToProject = formatModelProjection<T>(
        projection.includes,
        projection.excludes,
      );
    }
    let query = this.model.find(filter, objectToProject);
    if (populate) {
      const populatedFields: PopulateOptions[] = formatModelPopulate(populate);
      query.populate(populatedFields);
    }
    if (options && options.limit) {
      query.limit(options.limit);
    }
    if (options && options.sort) {
      query.sort(options.sort);
    }
    const result = await query.exec();
    return result;
  }

  async updateOne(filter: FilterQuery<T>, update: any): Promise<T | null> {
    return (
      await this.model.findOneAndUpdate(filter, update, { new: true })
    ).toObject();
  }

  async updateMany(filter: FilterQuery<T>, update: any): Promise<void> {
    await this.model.updateMany(filter, update).exec();
  }
  async countDocument(filter: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments(filter);
  }
  async create(data: T): Promise<T> {
    return (await this.model.create(data)).toObject();
  }
}
