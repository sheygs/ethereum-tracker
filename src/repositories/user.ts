import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export interface ID {
  id: string;
}

export class UniversalRepository<T extends ObjectLiteral> {
  constructor(private readonly entity: Repository<T>) {}

  public async create(payload: DeepPartial<T>): Promise<T> {
    try {
      const record = await this.entity.save(payload);

      return record;
    } catch (error) {
      throw error;
    }
  }

  public async findByID(id: any): Promise<T | null> {
    try {
      const options: FindOptionsWhere<T> = { id: id };
      return await this.entity.findOneBy(options);
    } catch (error) {
      throw error;
    }
  }

  public async findOne(filterOptions: FindOneOptions<T>): Promise<T | null> {
    try {
      return await this.entity.findOne(filterOptions);
    } catch (error) {
      throw error;
    }
  }

  public async findAll(filterOptions?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.entity.find(filterOptions);
    } catch (error) {
      throw error;
    }
  }

  public async remove(data: T): Promise<T> {
    try {
      return await this.entity.remove(data);
    } catch (error) {
      throw error;
    }
  }
}
