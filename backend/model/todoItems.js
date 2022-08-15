const mongoose = require('mongoose');

//each todolist is linked to a username, allowing for different users to have different todolists stored
const TodoItemSchema = new mongoose.Schema({
    username: {
        type: String
    },
    items: [
        {
            type: String,
            required: true
        },
    ],
})

module.exports = mongoose.model('todo', TodoItemSchema);

