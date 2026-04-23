import { body } from 'express-validator';

export const createScanValidator = [
  body('url')
    .notEmpty().withMessage('URL is required')
    .isURL({ 
      protocols: ['http', 'https'],
      require_protocol: true 
    }).withMessage('Must be a valid URL with http:// or https://'),
];