const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);

const port = process.env.PORT || 3000;

connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to database:', error.message);
        process.exit(1);
    });