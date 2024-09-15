const express = require('express')
const pollsRoutes = require('./routes/polls');


const app = express()
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Use the user routes
app.use('/poll', pollsRoutes);

app.listen(5000)