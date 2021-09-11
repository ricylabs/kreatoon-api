const router = require('express').Router();
const handler = require('../handler/auth');

/**
 * @swagger
 * /auth/register:
 *      post:
 *          description: Register for kreatoon user account
 *          tags: [User]
 *          requestBody: 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              email: 
 *                                  description: email for new account
 *                                  type: string
 *                              password:
 *                                  description: password for new account
 *                                  type: string
 *          responses:
 *              200:
 *                  description: Returns a success string.
 */
router.post('/register', handler.register);

/**
 * @swagger
 * /auth/login:
 *      post:
 *          description: login for kreatoon user account. Will return auth-token on response headers.
 *          tags: [User]
 *          requestBody: 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              email: 
 *                                  description: email for login account
 *                                  type: string
 *                              password:
 *                                  description: password for login account
 *                                  type: string
 *          responses:
 *              200:
 *                  description: Returns a success string.
 */
router.post('/login', handler.login);

module.exports = router;