const mongoose = require('mongoose')

const tableSchema = mongoose.Schema({
    numTable: {
        type: Number,
        required: [true , 'A table must have number'],
        unique: [true , 'duplicated numTables']

    },
    
    QrCode: {
        type: String,
        required: [true , 'the table must have the QrCode']
    }
    ,
    status:{
        type: String,
    },
    type:{
        type: String,
        required: [true , 'A table must have a type']
    }

})

const table = mongoose.model('Table' , tableSchema)

module.exports = table