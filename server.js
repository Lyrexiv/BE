const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors'); 
const app = express();
const port = 3002;
app.use(cors());
app.use(express.json());
const productRoutes = require('./product/productRoutes');
const userRoutes = require('./user/userRoutes');
const cartRoutes = require('./cart/cart_Routes');
const adminRoutes = require('./admin/adminRoutes');

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/admin', adminRoutes);
app.get('*', (req, res) => {
    res.status(404).send('Không tìm thấy trang');
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
