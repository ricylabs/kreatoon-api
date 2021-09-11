const router = require('express').Router();
const handler = require('../handler/user');
const validation = require('../handler/validation');

/**
 * @swagger
 * /user/role:
 *      put:
 *          description: Edit role for User account
 *          tags: [User]
 *          requestBody: 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              role: 
 *                                  description: new role for user
 *                                  type: string
 *          responses:
 *              200:
 *                  description: Returns user id and new role.
 */
router.put('/role', validation.validation, handler.editRole);

module.exports = router;