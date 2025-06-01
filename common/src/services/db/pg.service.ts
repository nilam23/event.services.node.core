import { Pool, PoolConfig, QueryResult } from 'pg';

export class PostgresService {
  private pool: Pool;

  constructor(poolConfig: PoolConfig) {
    this.pool = new Pool(poolConfig);
  }

  // Formats WHERE clause conditions and values for SQL queries
  private formatWhereClause(where: Record<string, any>): { conditions: string; values: any[] } {
    const keys: string[] = Object.keys(where);
    const conditions: string = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
    const values: any[] = Object.values(where);
    return { conditions, values };
  }

  // Executes a raw SQL query with optional parameter values
  public async executeQuery<T>(sql: string, values: any[] = []): Promise<T[]> {
    const result: QueryResult<T> = await this.pool.query(sql, values);
    return result.rows;
  }

  // Creates a new record in the specified table and returns the created record
  public async create<T>(table: string, data: T): Promise<T> {
    const keys: string[] = Object.keys(data);
    const values: any[] = Object.values(data);
    const placeholders: string = keys.map((_, i) => `$${i + 1}`).join(', ');

    const sql: string = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const result: T[] = await this.executeQuery<T>(sql, values);
    return result[0];
  }

  // Finds a single record matching the where conditions
  public async findOne<T>(table: string, where: Record<string, any>, columns: string[] = ['*']): Promise<T | null> {
    const { conditions, values } = this.formatWhereClause(where);
    const sql: string = `SELECT ${columns.join(', ')} FROM ${table} WHERE ${conditions} LIMIT 1`;
    const result: T[] = await this.executeQuery<T>(sql, values);
    return result[0] || null;
  }

  // Finds multiple records matching the where conditions with optional ordering
  public async find<T>(
    table: string,
    where: Record<string, any>,
    columns: string[] = ['*'],
    orderBy: string = 'created_at',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<T[]> {
    const { conditions, values } = this.formatWhereClause(where);
    const sql = `SELECT ${columns.join(', ')} FROM ${table} WHERE ${conditions} ORDER BY ${orderBy} ${order}`;
    return this.executeQuery<T>(sql, values);
  }

  // Updates records matching the where conditions and returns the first updated record
  public async update<T>(table: string, where: Record<string, any>, data: Record<string, any>): Promise<T | null> {
    const updateKeys: string[] = Object.keys(data);
    const updateValues: any[] = Object.values(data);
    const setClause: string = updateKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const whereKeys: string[] = Object.keys(where);
    const whereValues: any[] = Object.values(where);
    const whereClause: string = whereKeys.map((key, i) => `${key} = $${i + updateKeys.length + 1}`).join(' AND ');

    const sql: string = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    const result: T[] = await this.executeQuery<T>(sql, [...updateValues, ...whereValues]);
    return result[0] || null;
  }

  // Deletes records matching the where conditions and returns the deleted records
  public async delete<T>(table: string, where: Record<string, any>): Promise<T[]> {
    const { conditions, values } = this.formatWhereClause(where);
    const sql = `DELETE FROM ${table} WHERE ${conditions} RETURNING *`;
    return this.executeQuery<T>(sql, values);
  }

  // Counts the number of records matching the where conditions
  public async count(table: string, where: Record<string, any>): Promise<number> {
    const { conditions, values } = this.formatWhereClause(where);
    const sql = `SELECT COUNT(*) FROM ${table} WHERE ${conditions}`;
    const result = await this.executeQuery<{ count: string }>(sql, values);
    return parseInt(result[0]?.count || '0', 10);
  }

  // Executes a raw SQL query with optional parameter values (alias for executeQuery)
  public async raw<T>(sql: string, values: any[] = []): Promise<T[]> {
    return this.executeQuery<T>(sql, values);
  }
}
