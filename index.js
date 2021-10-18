const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config();

const PORT = process.env.PORT;
const app = express();

/** Import Routes */
const todoListRoutes = require('./routes/todoList');
const userAuthRoutes = require('./routes/userAuth');
const userProfileRoutes = require('./routes/userProfile');

/** Connect to DB */

const db = process.env.DB_CONNECT;
mongoose.connect(db,  {useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log(`Successfully connected to DB...`)) 
        .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send({message: `ToDoList_API running successfully.`});
});

/** Middlewares */
app.use(express.json());


/** Route Middlewares */
app.use('/todo', todoListRoutes);
app.use('/user', userAuthRoutes);
app.use('/user/profile', userProfileRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
