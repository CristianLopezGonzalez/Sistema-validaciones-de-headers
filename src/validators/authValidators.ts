import { body } from 'express-validator';

export const registerValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('name').isLength({ min: 2, max: 100 }),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
];
