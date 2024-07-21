const express = require('express');
const router = express.Router();
const { checkLogin, getUserInfoByUser_ID, registerUser, queryUserById, EditUser } = require('./userQueries');

router.post('/login', async (req, res) => {
    const { username, password } = req.body; // Lấy thông tin đăng nhập từ phần thân của yêu cầu
    try {
        const isValidUser = await checkLogin(username, password);
        // Trả về kết quả dưới dạng JSON
        console.log({isValidUser})
        res.json( isValidUser );
    } catch (error) {
        console.error('Lỗi truy vấn USER:', error);
        res.status(500).json({ error: 'Lỗi truy vấn USER' });
    }
});

// Router để lấy thông tin người dùng từ username
router.post('/user-info', async (req, res) => {
    const { userid } = req.body;
    try {
        const userInfo = await getUserInfoByUser_ID(userid);
        res.json(userInfo);
    } catch (error) {
        console.error('Lỗi truy vấn thông tin người dùng:', error);
        res.status(500).json({ error: 'Lỗi truy vấn thông tin người dùng' });
    }
});
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const result = await registerUser(username, password);
      res.status(201).json(result);
    } catch (error) {
      if (error.message === 'Tên người dùng đã tồn tại.') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng ký tài khoản.' });
      }
    }
  });
  router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await queryUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        res.json(user);
    } catch (error) {
        console.error(`Lỗi truy vấn người dùng ${userId}:`, error);
        res.status(500).json({ error: `Lỗi truy vấn người dùng ${userId}` });
    }
});
router.put('/update-user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, address } = req.body;

  try {
      const result = await EditUser(userId, fullName, email,  address);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.' });
  }
});



module.exports = router;

