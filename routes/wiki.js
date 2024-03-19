//here the route handler callbacks are defined directly in the router function; for more security they can be 
//separated, as 
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

router.get('/', function(req, res, next){
    res.send('Wiki home page')
})

router.get('/a+b+out/:bookId',asyncHandler(async(req, res, next)=>{
    res.send(`About this wiki: params ${req.params.bookId}`)
}))

module.exports = router