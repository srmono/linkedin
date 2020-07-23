const express = require('express');
const connectDB = require('./config/db');
connectDB();

const users = require('./routes/users');
const profile = require('./routes/profile');
const posts = require('./routes/posts');
const auth = require('./routes/auth');

const app = express();
app.use(express.json({ extended: false }))

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/auth', auth);

app.get('/', (req,res) => {
    res.send("server is running successfully")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server is running on port 5000"))