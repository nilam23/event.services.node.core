import { NextFunction, Request, Response } from 'express';
import { bcryptHelpers, HttpStatusCodes, IUser, jwtHelpers, pgErrorCodes } from '@bts-ubiquitous/events';
import { pool } from '@configs/postgresql.config';
import { QueryResult } from 'pg';

export class AuthController {
  /**
   * @description the controller method responsible for user signup
   * @param {Request} req the express request object
   * @param {Response} res the express response object
   * @param {NextFunction} next the express next function in the cycle
   */
  public signup = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { name, email, phone, password } = req.body;

      const hashedPassword: string = await bcryptHelpers.hash(password);

      const pgInsertResultL: PromiseSettledResult<QueryResult<any>>[] = await Promise.allSettled([
        pool.query('INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, phone, hashedPassword]),
      ]);

      if (pgInsertResultL[0].status === 'rejected') {
        if (pgInsertResultL[0].reason?.code === pgErrorCodes.UNIQUE_VIOLATION)
          return res.status(HttpStatusCodes.CONFLICT).json({ message: 'user already exists' });
        else if (pgInsertResultL[0].reason?.code === pgErrorCodes.NOT_NULL_VIOLATION)
          return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'some fields are missing' });
        else return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: pgInsertResultL[0].reason?.message || 'something went wrong' });
      } else {
        const user: IUser = pgInsertResultL[0].value.rows[0];
        const token: string = jwtHelpers.createToken({ userId: user.id, email: user.email, role: user.role });

        return res.status(HttpStatusCodes.CREATED).json({ message: 'success', data: { token } });
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description the controller method responsible for user signin
   * @param {Request} req the express request object
   * @param {Response} res the express response object
   * @param {NextFunction} next the express next function in the cycle
   */
  public signin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email, password } = req.body;

      const pgSelectResultL: PromiseSettledResult<QueryResult<any>>[] = await Promise.allSettled([
        pool.query('SELECT id, email, password, role FROM users WHERE email = $1', [email]),
      ]);

      if (pgSelectResultL[0].status === 'rejected') {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: pgSelectResultL[0].reason?.message || 'something went wrong' });
      } else {
        const user: IUser = pgSelectResultL[0].value.rows[0];

        if (!user) return res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'user not found' });

        const isPasswordValid: boolean = await bcryptHelpers.compare(password, user.password);

        if (!isPasswordValid) return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: 'incorrect password' });

        const token: string = jwtHelpers.createToken({ userId: user.id, email: user.email, role: user.role });

        await pool.query('UPDATE users SET last_logged_in_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

        return res.status(HttpStatusCodes.OK).json({ message: 'success', data: { token } });
      }
    } catch (error) {
      next(error);
    }
  };
}
