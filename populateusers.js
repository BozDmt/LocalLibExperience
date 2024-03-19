#!/bin/env/node

const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const mongoConn = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.5'

const libMember = require('./models/libmember')

const libMembers = []

main().catch((err) => console.log(err))

async function main(){
    console.log('connecting to database. inserting users...')
    await mongoose.connect(mongoConn)
    insertUsers(libmembers)
    console.log('done. Closing connection')

}

function insertUsers(arr){
    arr.push(new libMember({
        name: "Bozhidar"
    }))    
}