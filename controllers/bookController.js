const asyncHandler = require('express-async-handler')
const Book = require('../models/book')
const Author = require('../models/author')
const Genre = require('../models/genre')
const BookInstance = require('../models/bookInstance')
const {body, validationResult} = require('express-validator')

exports.index = asyncHandler(async(req,res,next)=>{
    const [
        numBooks,
        numAuthors,
        numGenres,
        numBookInstances,
        numAvailableBookInstances
    ] = await Promise.all([
        Book.countDocuments({}).exec(),
        Author.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
        BookInstance.countDocuments({}).exec(),
        BookInstance.countDocuments({status: 'Available'}).exec()
    ])

    res.render('index',{
        title: 'LocalLib home page',
        book_count: numBooks,
        author_count: numAuthors,
        genre_count: numGenres,
        bookinstance_count: numBookInstances,
        avl_bookinstance_count: numAvailableBookInstances
    })
})

exports.book_list = asyncHandler(async(req,res,next)=>{
    const allBooks = await Book.find({},'title author')
    .sort({title: 1})
    .populate('author')
    .exec()

    res.render('book_list', {title: 'Book List', book_list: allBooks})
})

exports.book_detail = asyncHandler(async(req,res,next)=>{
    const [bookDetails,bookinstance] = await Promise.all([
        Book.findById(req.params.id).populate('author').populate('genre').exec(),
        BookInstance.find({book: req.params.id}).exec(),
    ])

    if(bookDetails === null){
        const err = new Error('Book not found')
        err.status = 404
        return next(err)
    }

    res.render('book_details', {
        book_title: bookDetails.title, 
        book_detail: bookDetails, 
        book_instance: bookinstance
    })
})

exports.book_create_get = asyncHandler(async(req,res,next)=>{
    const [allAuthors,allGenres] = await Promise.all([
        Author.find().sort({last_name: 1}).exec(),
        Genre.find().sort({name: 1}).exec()
    ])

    res.render('book_form',{title:'Create Book',authors: allAuthors, genres: allGenres})
})

exports.book_create_post = [
    (req,res,next) => {
        if(!Array.isArray(req.body.genre)){
            req.body.genre = typeof req.body.genre === 'undefined'? []:[req.body.genre]
        }
        next()
    },

    body('authorName')
    .trim()
    .isLength({min: 4})
    .escape()
    .withMessage('Author must be specified')
    ,body('title','Title must be specified')
    .isLength({min: 3})
    .trim()
    .blacklist('<>')
    ,body('summary','Summary must be provided')
    .trim()
    .blacklist('<>')
    ,body('isbn','ISBN must be specified')
    .trim()
    .escape()
    ,body('genre.*')
    .escape(),

    asyncHandler(async(req,res,next) =>{
        const errors = validationResult(req)

        const book = new Book({
            title: req.body.title,
            author: req.body.authorName,
            genre: req.body.genre,
            isbn: req.body.isbn,
            summary: req.body.summary,
        })

        if(!errors.isEmpty()){
            const [allAuthors,allGenres] = await Promise.all([
                Author.find().sort({last_name: 1}).exec(),
                Genre.find().sort({name: 1}).exec()
            ])

            for(genre of allGenres){
                if(book.genre.includes(genre._id)){
                    genre.checked = 'true'
                }
            }

            res.render('book_form',{
                title: 'Create Book',
                authors: allAuthors,
                genres: allGenres,
                book:book,
                errors: errors.array(),
            })
            return
        }
        else{
            const bookExists = await Book.find({title: req.body.title}).exec()
        
            if(bookExists === null || bookExists === undefined){
                res.send(`Book '${bookExists}' exists`)
            }
            else{
                await book.save()
                res.redirect(book.url)
            }
        }
    })]

    exports.book_delete_get = asyncHandler(async(req,res,next)=>{
        const [book, bookCopies] = await Promise.all([
            Book.findById(req.params.id).exec(),
            BookInstance.find({book: req.params.id},'book imprint status due_back'),
        ])

        res.render('book_delete', {
            title: 'Delete book',
            book:book,
            copies: bookCopies,
        })
})

exports.book_delete_post = asyncHandler(async(req,res,next)=>{
    const [book, bookCopies] = await Promise.all([
        Book.findById(req.params.id).exec(),
        BookInstance.find({book: req.params.id},'book imprint status due_back'),
    ])

    if(bookCopies.length > 0){
        res.render('book_delete', {
            title: 'Delete book',
            book:book,
            copies: bookCopies,
        })
        return
    }
    else{
        Book.findByIdAndDelete(req.body.bookid).exec()
        res.redirect('/catalog/books')
    }
})

exports.book_update_get = asyncHandler(async(req,res,next)=>{
    const [book,allAuthors,allGenres] = await Promise.all([
        Book.findById(req.params.id).exec(),
        Author.find({}).sort({last_name: 1}).exec(),
        Genre.find({}).sort({name: 1}).exec(),
    ])

    if(book===null){
        const err = new Error('Book not found')
        err.status = 404
        return next(err)
    }

    allGenres.forEach((genre) => {
        if(book.genre.includes(genre._id)){
            genre.checked = true
        }
    });

    res.render('book_form',{
        title: 'Update book',
        book:book,
        authors:allAuthors,
        genres:allGenres,
    })
})

exports.book_update_post = [
    (req,res,next) => {
        if(!Array.isArray(req.body.genre)){
            req.body.genre = typeof req.body.genre === 'undefined'? []:[req.body.genre]
        }
        next()
    },

    body('authorName')
    .trim()
    .isLength({min: 4})
    .escape()
    .withMessage('Author must be specified')
    ,body('title','Title must be specified')
    .isLength({min: 3})
    .trim()
    .blacklist('<>')
    ,body('summary','Summary must be provided')
    .trim()
    .blacklist('<>')
    ,body('isbn','ISBN must be specified')
    .trim()
    .escape()
    ,body('genre.*')
    .escape(),

    asyncHandler(async(req,res,next) =>{
        const errors = validationResult(req)

        const book = new Book({
            title: req.body.title,
            author: req.body.authorName,
            isbn: req.body.isbn,
            summary: req.body.summary,
            genre: typeof req.body.genre === 'undefined' ? []: req.body.genre,
            _id: req.params.id,//old id should be passed bc after update it changes
        })

        if(!errors.isEmpty()){
            const [allAuthors,allGenres] = await Promise.all([
                Author.find().sort({last_name: 1}).exec(),
                Genre.find().sort({name: 1}).exec()
            ])

            for(genre of allGenres){
                if(book.genre.includes(genre._id)){
                    genre.checked = 'true'
                }
            }

            res.render('book_form',{
                title: 'Create Book',
                authors: allAuthors,
                genres: allGenres,
                book:book,
                errors: errors.array(),
            })
            return
        }
        else{
                const updatedBook = await Book.findByIdAndUpdate(req.params.id,book,{})
                res.redirect(updatedBook.url)
            }
    })
]