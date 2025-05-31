import { Model, FilterQuery, UpdateQuery, AggregateOptions, SortOrder, AnyBulkWriteOperation, PipelineStage, Document } from 'mongoose';
import { BulkWriteOptions, BulkWriteResult } from 'mongodb';
import { establishMongooseConnection } from '@configs/mongoose.config';

export class MongooseService {
  private static isConnected: boolean = false;

  constructor() {
    this.connectToMongoose();
  }

  /**
   * manage mongoose connection
   */
  private async connectToMongoose(): Promise<void> {
    if (!MongooseService.isConnected) {
      await establishMongooseConnection();

      MongooseService.isConnected = true;
    }
  }

  /**
   * create a single document
   */
  public async create<T>(model: Model<T & Document>, doc: T): Promise<T> {
    return model.create(doc);
  }

  /**
   * insert multiple documents
   */
  public async insertMany<T>(model: Model<T & Document>, docs: T[], ordered: boolean = false): Promise<T[]> {
    return model.insertMany(docs, { ordered }) as unknown as T[];
  }

  /**
   * bulk write operations
   */
  public async bulkWrite<T>(
    model: Model<T & Document>,
    operations: AnyBulkWriteOperation<any>[],
    options?: BulkWriteOptions,
  ): Promise<BulkWriteResult> {
    return model.bulkWrite(operations, options);
  }

  /**
   * find a single document
   */
  public async findOne<T>(
    model: Model<T & Document>,
    filterQuery: FilterQuery<T>,
    projectQuery: Partial<Record<keyof T, 1 | 0>> = { __v: 0 } as any,
    sortQuery: Partial<Record<keyof T, SortOrder>> = { createdAt: -1 } as any,
  ): Promise<T | null> {
    return model.findOne(filterQuery, projectQuery).sort(sortQuery).lean<T>().exec();
  }

  /**
   * find multiple documents
   */
  public async find<T>(
    model: Model<T & Document>,
    filterQuery: FilterQuery<T>,
    projectQuery: Partial<Record<keyof T, 1 | 0>> = { __v: 0 } as any,
    sortQuery: Partial<Record<keyof T, SortOrder>> = { createdAt: -1 } as any,
  ): Promise<T[]> {
    return model.find(filterQuery, projectQuery).sort(sortQuery).lean<T[]>().exec();
  }

  /**
   * aggregate query
   */
  public async aggregate<T>(model: Model<T & Document>, pipeline: PipelineStage[], options?: AggregateOptions): Promise<T[]> {
    return model.aggregate(pipeline, options).exec();
  }

  /**
   * find documents' count
   */
  public async count<T>(model: Model<T & Document>, filterQuery: FilterQuery<T>): Promise<number> {
    return model.countDocuments(filterQuery).lean<number>().exec();
  }

  /**
   * find one and update
   */
  public async findOneAndUpdate<T>(
    model: Model<T & Document>,
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T & Document>,
    projectQuery: Partial<Record<keyof T, 1 | 0>> = { __v: 0 } as any,
    options: { new?: boolean; upsert?: boolean } = { new: true },
  ): Promise<T | null> {
    return model.findOneAndUpdate(filterQuery, updateQuery, options).select(projectQuery).lean<T>().exec();
  }

  /**
   * find one and delete
   */
  public async findOneAndDelete<T>(model: Model<T & Document>, filterQuery: FilterQuery<T>): Promise<T | null> {
    return model.findOneAndDelete(filterQuery).lean<T>().exec();
  }
}
