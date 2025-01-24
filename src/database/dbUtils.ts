import { getDBConnection } from './database';

export const executeQuery = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    const db = getDBConnection();
    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const insertRecord = async (table: string, data: Record<string, any>) => {
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  return executeQuery(query, values);
};

export const updateRecord = async (
  table: string,
  data: Record<string, any>,
  whereClause: string,
  whereParams: any[]
) => {
  const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), ...whereParams];

  const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  return executeQuery(query, values);
};

export const deleteRecord = async (table: string, whereClause: string, whereParams: any[] = []) => {
  const query = `DELETE FROM ${table} WHERE ${whereClause}`;
  return executeQuery(query, whereParams);
};

export const getRecords = async (table: string, whereClause?: string, whereParams: any[] = []) => {
  const query = `SELECT * FROM ${table}${whereClause ? ` WHERE ${whereClause}` : ''}`;
  const result = await executeQuery(query, whereParams);
  return result.rows._array;
};
