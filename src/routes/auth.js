const router = require('express').Router();
const handler = require('../handler/auth');

/**
 * @swagger
 * /auth/creator/register:
 *      post:
 *          description: Register for kreatoon creator account
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
router.post('/creator/register', handler.register('creator'));

/**
 * @swagger
 * /auth/creator/login:
 *      post:
 *          description: login for kreatoon creator account. Will return auth-token on response headers.
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
router.post('/creator/login', handler.login('creator'));

/**
 * @swagger
 * /auth/reader/register:
 *      post:
 *          description: Register for kreatoon reader account
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
router.post('/reader/register', handler.register('reader'));

 /**
  * @swagger
  * /auth/reader/login:
  *      post:
  *          description: login for kreatoon reader account. Will return auth-token on response headers.
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
router.post('/reader/login', handler.login('reader'));

module.exports = router;