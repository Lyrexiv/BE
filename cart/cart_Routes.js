const express = require('express');
const router = express.Router();
const { InserCart, Cart_Info, Delete } = require('./cart_Queries');
router.post('/adds', async (req, res) => {
    const { Id,  user_id,productname ,quantity, price, img, subtotal } = req.body;
    
    try {
      const result = await InserCart( Id,  user_id, productname ,quantity, price, img, subtotal);
      res.status(201).json(result);
    } catch (error) {
     
        res.status(500).json({ error: 'Đã xảy ra lỗi khi them sa.' });
      
    }
  });
  router.post('/cart-info', async (req, res)=> {
    const {user_id} = req.body;
    
    try {
      const cart = await Cart_Info(user_id);
      res.json(cart);
     
    } catch (error) {
        console.error('Lỗi truy vấn Cart:', error);
        res.status(500).json({ error: 'Lỗi truy vấn cart' });
    }
    
  }); 

  router.post('/delete-item', async(req, res) => {
    const {cart_id} = req.body;
    try{
      const result = await Delete(cart_id);
      res.status(201).json(result);
      console.log({result })
    } catch (error) {
      res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
    }
  });
  module.exports = router;