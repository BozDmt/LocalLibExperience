const BookInstance = require('../models/bookInstance')
const asyncHandler = require('express-async-handler')
const {body, validationResult} = require('express-validator')
const Book = require('../models/book')

exports.bookInstance_list = asyncHandler(async(req,res,next)=>{
    const allBookinstances = await BookInstance.find()
    .populate('book').exec()
    
    res.render('bookinstance_list',{
        title: 'List of book copies',
        bookinstance_list: allBookinstances,
    })
})

exports.bookInstance_detail = asyncHandler(async(req,res,next)=>{
    const bookinstance = await BookInstance.findById(req.params.id).populate('book').exec()

    res.render('bookinstance_details', {
        bookinstance: bookinstance,
    })
})

exports.bookInstance_create_get = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec() 
  
    res.render("bookinstance_form",{
        title: 'Create a copy',
        book_list: allBooks,
    })
});
  

exports.bookInstance_create_post = [
    body('book','Book must be specified')
    .trim()
    ,
    body('imprint','Book imprint must be specified')
    .trim()
    .blacklist('<>')
    ,
    body('status','Please specify a status')
    .escape(),
    body('due_back','Invalid Date')
    .optional({values: 'falsy'})
    .isISO8601()
    .toDate(),

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req)

        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            due_back: req.body.due_back,
            status: req.body.status,
        })


        console.log(bookInstance)
        if(!errors.isEmpty()){
            const allBooks = await Book.find({},'title').sort({title: 1}).exec()

            res.render('bookinstance_form',{
                title: 'Create a copy',
                book_list: allBooks, 
                selected_book: bookInstance.book._id,
                bookinstance: bookInstance,
                errors: errors.array(),
            })
            return
        }
        else{
            await bookInstance.save()
            res.redirect(bookInstance.url)
        }
    }),
    

]

exports.bookInstance_delete_get = asyncHandler(async(req,res)=>{
    const copy = await BookInstance.findById(req.params.id).populate('book').exec()

    if(copy.status==='Loaned'){
        res.send('<p style=\'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);font-size:30px;border:3px solid #ccc;\'>The copy is loaned at the moment.<p/>',)
    }
    else{
        res.render('bookinstance_delete',{
            bookinstance: copy,
        })
    }
})

exports.bookInstance_delete_post = asyncHandler(async(req,res)=>{
    await BookInstance.findByIdAndDelete(req.params.id).exec()
    res.redirect('/catalog/bookinstances')
})

exports.bookInstance_update_get = asyncHandler(async(req,res,next)=>{
    res.send('Not implemented: BookInstance update get')
})

exports.bookInstance_update_post = asyncHandler(async(req,res,next)=>{
    res.send('Not implemented: BookInstance update post')
})
