import { NextFunction, Request, Response } from 'express';
import { bcryptHelpers, HttpStatusCodes, IUser, jwtHelpers, pgErrorCodes } from '@bts-ubiquitous/events';
import { pgService } from '@configs/postgres.config';

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

      const pgInsertResult: PromiseSettledResult<IUser>[] = await Promise.allSettled([
        pgService.create<IUser>('users', { name, email, phone, password: hashedPassword }),
      ]);

      if (pgInsertResult[0].status === 'rejected') {
        if (pgInsertResult[0].reason?.code === pgErrorCodes.UNIQUE_VIOLATION)
          return res.status(HttpStatusCodes.CONFLICT).json({ message: 'user already exists' });
        else if (pgInsertResult[0].reason?.code === pgErrorCodes.NOT_NULL_VIOLATION)
          return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'some fields are missing' });
        else return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: pgInsertResult[0].reason?.message || 'something went wrong' });
      } else {
        const user: IUser = pgInsertResult[0].value;
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

      const user: IUser = await pgService.findOne<IUser>('users', { email });

      if (!user) return res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'user not found' });

      const isValidPassword: boolean = await bcryptHelpers.compare(password, user.password);

      if (!isValidPassword) return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: 'incorrect password' });

      const token: string = jwtHelpers.createToken({ userId: user.id, email: user.email, role: user.role });

      await pgService.update('users', { id: user.id }, { last_logged_in_at: new Date(), updated_at: new Date() });

      return res.status(HttpStatusCodes.OK).json({ message: 'success', data: { token } });
    } catch (error) {
      next(error);
    }
  };
}
