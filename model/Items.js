const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        default: 'Not Completed'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true, collection: 'ToDoList_Items'});

module.exports = mongoose.model('Item', ItemSchema);
