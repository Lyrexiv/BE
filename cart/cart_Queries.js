const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
async function initialize() {
    try {
      await oracledb.createPool({
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString
      });
      console.log('Connection pool created successfully.');
    } catch (err) {
      console.error('Error creating connection pool:', err);
    }
  }
  initialize()
  async function InserCart( Id,  user_id, productname , quantity, price, img, subtotal ) {
    let connection;
    try {
       
        connection = await oracledb.getConnection(dbConfig);      
        await connection.execute('INSERT INTO CART (User_ID, ID, PRODUCTNAME, Quantity, PRICE, IMG, SUBTOTAL) VALUES (:user_id, :Id,:productname  ,:quantity, : price, :img, :subtotal)', 
        {user_id, Id,productname , quantity, price, img, subtotal});
    
        
          // Commit transaction
          await connection.commit();
      
          // Giải phóng kết nối
          await connection.close();
          return { message: 'them san pham thanh cong.' };
    } catch (err) {
        console.log('Lỗi khi them san pham:', error);
        
        
    }
}
   async function Cart_Info(user_id) {
      let connection;
      try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT * FROM CART WHERE USER_ID = :user_id', [user_id]);
        return result.rows;

      } catch (error) {
          throw error;
      } finally {
          if (connection) {
              try {
                  await connection.close();
              } catch (error) {
                  console.error('Lỗi khi đóng kết nối:', error);
              }
          }
      }
   }
   async function Delete(cart_id) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn xóa sản phẩm dựa trên cartId
        const result = await connection.execute('DELETE FROM Cart WHERE CartId = :cartId', [cart_id]);
        await connection.commit(); // Commit transaction
        await connection.close(); // Đóng kết nối
        return { message: 'Xóa sản phẩm thành công.' };

        // Kiểm tra số lượng hàng bị ảnh hưởng
      
    } catch (error) {
        console.log('Lỗi khi xóa sản phẩm:', error);
        // Có thể thêm xử lý lỗi khác tại đây, ví dụ: ghi log, báo lỗi, vv.
        return { message: 'Đã xảy ra lỗi khi xóa sản phẩm.' };
    }
}





module.exports = { InserCart, Cart_Info, Delete};