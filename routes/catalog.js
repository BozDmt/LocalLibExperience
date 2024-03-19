const express = require('express')
const router = express.Router()

const author_controller = require('../controllers/authorController')
const book_controller = require('../controllers/bookController')
const bookInstance_controller = require('../controllers/bookinstanceController')
const genre_controller = require('../controllers/genreController')


//home page
router.get('/',book_controller.index)

router.get('/book/create',book_controller.book_create_get)
router.post('/book/create',book_controller.book_create_post)

router.get('/book/:id/update',book_controller.book_update_get)
router.post('/book/:id/update',book_controller.book_update_post)

router.get('/book/:id/delete',book_controller.book_delete_get)
router.post('/book/:id/delete',book_controller.book_delete_post)

router.get('/book/:id',book_controller.book_detail)
//books list must come after create, so as not to look up an empty list
router.get('/books',book_controller.book_list)

//authors
router.get('/author/create', author_controller.author_create_get)
router.post('/author/create', author_controller.author_create_post)

router.get( '/author/:id/update', author_controller.author_update_get)
router.post('/author/:id/update', author_controller.author_update_post)

router.get( '/author/:id/delete', author_controller.author_delete_get)
router.post('/author/:id/delete', author_controller.author_delete_post)

router.get('/author/:id', author_controller.author_detail)
router.get('/authors', author_controller.author_list)

//bookinstances
router.get('/bookInstance/create', bookInstance_controller.bookInstance_create_get)
router.post('/bookInstance/create', bookInstance_controller.bookInstance_create_post)

router.get('/bookInstance/:id/update', bookInstance_controller.bookInstance_update_get)
router.post('/bookInstance/:id/update', bookInstance_controller.bookInstance_update_post)

router.get( '/bookInstance/:id/delete', bookInstance_controller.bookInstance_delete_get)
router.post('/bookInstance/:id/delete', bookInstance_controller.bookInstance_delete_post)

router.get( '/bookInstance/:id', bookInstance_controller.bookInstance_detail)
router.get('/bookInstances', bookInstance_controller.bookInstance_list)

//genres
router.get( '/genre/create', genre_controller.genre_create_get)
router.post('/genre/create', genre_controller.genre_create_post)

router.get('/genre/:id/update', genre_controller.genre_update_get)
router.post('/genre/:id/update', genre_controller.genre_update_post)

router.get('/genre/:id/delete', genre_controller.genre_delete_get)
router.get('/genre/:id/delete', genre_controller.genre_delete_post)

router.get('/genre/:id', genre_controller.genre_detail)
router.get('/genres', genre_controller.genre_list)

module.exports = router