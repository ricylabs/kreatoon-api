const router = require('express').Router();
const multer = require('multer');
const handler = require('../handler/karya');
const validation = require('../handler/validation');

const upload = multer({storage: multer.memoryStorage() });

/**
 * @swagger
 * /karya/create:
 *      post:
 *          description: Create new Karya. Input the auth-token from respon header after login. (only user with role = creater can access this route)
 *          tags: [Karya]
 *          parameters:
 *            - in: header
 *              name: auth-token
 *              schema: 
 *                  type: string
 *              required: true
 *          requestBody: 
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              title: 
 *                                  description: title for new Karya
 *                                  type: string
 *                              desc:
 *                                  description: synopsis
 *                                  type: string
 *                              image: 
 *                                  description: image for cover
 *                                  type: string
 *                                  format: binary
 *                              genre:
 *                                  description: Karya's genre
 *                                  type: array
 *                              community:
 *                                  description: Karya's community link
 *                                  type: string
 *          responses:
 *              200:
 *                  description: Returns a success string and url to open uploaded image.
 */
router.post('/create', validation.validation, validation.creatorValidation, upload.single('image'), handler.newKarya);

/**
 * @swagger
 * /karya/upload:
 *      post:
 *          description: Create new Karya. Input the auth-token from respon header after login. (only user with role = creater can access this route)
 *          tags: [Karya]
 *          parameters:
 *            - in: header
 *              name: auth-token
 *              schema: 
 *                  type: string
 *              required: true
 *          requestBody: 
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              _id: 
 *                                  description: the id of Karya you want to upload
 *                                  type: string
 *                              name:
 *                                  description: chapter name
 *                                  type: string
 *                              chapter: 
 *                                  description: chapter
 *                                  type: integer
 *                              images:
 *                                  type: array
 *                                  items: 
 *                                      type: string
 *                                      format: binary
 *          responses:
 *              200:
 *                  description: Returns a success string and url to open uploaded image.
 */
router.post('/upload', validation.validation, validation.creatorValidation, upload.array('images', 10), handler.uploadKarya);

/**
 * @swagger
 * /karya/update:
 *      post:
 *          description: Update existing chapter. Input the auth-token from respon header after login. (only user with role = creater can access this route)
 *          tags: [Karya]
 *          parameters:
 *            - in: header
 *              name: auth-token
 *              schema: 
 *                  type: string
 *              required: true
 *          requestBody: 
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              _id: 
 *                                  description: the id of Karya you want to upload
 *                                  type: string
 *                              name:
 *                                  description: new chapter name
 *                                  type: string
 *                              chapter: 
 *                                  description: the chapter you want to change
 *                                  type: integer
 *                              images:
 *                                  type: array
 *                                  items: 
 *                                      type: string
 *                                      format: binary
 *          responses:
 *              200:
 *                  description: Returns a success string and url to open uploaded image.
 */
router.put('/update', validation.validation, validation.creatorValidation, upload.array('images', 10), handler.updateChapter);

/**
 * @swagger
 * /karya:
 *      get:
 *          description: Get all karya
 *          tags: [Karya]
 *          responses:
 *              200:
 *                  description: Returns all existing Karya
 */
router.get('/', handler.getKarya);

/**
 * @swagger
 * /id/{id}:
 *      get:
 *          description: get Karya by id
 *          tags: [Karya]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema: 
 *                  type: string
 *              required: true
 *          responses:
 *              200:
 *                  description: Returns Karya by id.
 */
router.get('/id/:id', handler.getKaryaById);

module.exports = router;