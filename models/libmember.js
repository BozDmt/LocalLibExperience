const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LibrarymemberSchema = new Schema({
    first_name: {type: String, required: true, maxlength: 100},
    last_name: {type: String, required: true,maxlength: 150},
    books_loaned: [{type: Schema.Types.ObjectId, ref:"Book"}],
    date_of_birth: {type: Date, required: true},
})

LibrarymemberSchema.virtual("url").get(function(){
    return `/users/${this._id}`
})

modules.export = mongoose.model("Library Member", LibrarymemberSchema)