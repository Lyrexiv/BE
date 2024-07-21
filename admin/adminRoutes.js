const express = require('express');
const { AdminDashboard, AddProduct, EditProduct, DeleteProducts, queryUser, DeleteUsers} = require('./adminQueries');
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const admin = await AdminDashboard();
        res.json(admin);
    } catch (error) {
        console.error('Lỗi truy vấn', error);
        res.status(500).json({ error: 'Lỗi truy vấn ' });
    }
});
router.post('/product', async (req, res) => {
    const { model, cpu, gpu, ram, storage, screenSize, resolution, price, img, img1, img2, img3, manufacturer } = req.body;
    
    try {
      const result = await AddProduct(model, cpu, gpu, ram, storage, screenSize, resolution, price, img, img1, img2, img3, manufacturer);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm sản phẩm.' });
    }
  });
  router.put('/product/:id', async (req, res) => {
    const { id } = req.params;
    const { model, cpu, gpu, ram, storage, screenSize, resolution, price, img, img1, img2, img3, manufacturer } = req.body;

    try {
        const result = await EditProduct(id, model, cpu, gpu, ram, storage, screenSize, resolution, price, img, img1, img2, img3, manufacturer);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật sản phẩm.' });
    }
});
router.post('/delete-item', async(req, res) => {
  const {id} = req.body;
  try{
    const result = await DeleteProducts(id);
    res.status(201).json(result);
    console.log({result })
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
    console.log(error)
  }
});

router.get('/users', async (req, res) => {
  try {
      const listusers = await queryUser();
      res.json(listusers);
  } catch (error) {
      console.error('Lỗi truy vấn product1:', error);
      res.status(500).json({ error: 'Lỗi truy vấn product1' });
  }
});
router.post('/delete-user', async(req, res) => {
  const {id} = req.body;
  try{
    const result = await DeleteUsers(id);
    res.status(201).json(result);
    console.log({result })
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
    console.log(error)
  }
});

module.exports = router;
