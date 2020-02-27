import { Request, Response } from 'express';
import { User } from '../schemas/user';

export class UserController {
	async index(req: Request, res: Response): Promise<Response> {
		const users = await User.find();
		return res.json(users);
	}

	async store(req: Request, res: Response): Promise<Response> {
		const user = await User.create(req.body);
		return res.json(user);
	}
}

export default new UserController();
