/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */

import express, { Request, Response } from 'express';
import httpStatus from 'http-status';

import { User } from '../models';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  let isValidPassword = await user.validPassword(password);

  if (!isValidPassword) {
    res.status(400).send('Invalid email or password');
    return;
  }
  res.status(httpStatus.OK).json(user.toAuthJSON());
});

router.post('/register', async (req, res) => {
  const user = new User({ ...req.body });
  await user.save();
  res.status(httpStatus.CREATED).json(user.toAuthJSON());
});

router.post('/:username', async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!!user) {
    res.status(400).send(false);
    return;
  }
  res.status(httpStatus.OK).json(true);
});

router.get('/me', async (req: Request, res: Response) => {
  res.send(req.user);
});

export default router;
