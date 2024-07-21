const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
async function AdminDashboard() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const customersResult = await connection.execute('SELECT COUNT(*) AS total_customers FROM users WHERE role = :role', ['USER']);
        const productsResult = await connection.execute('SELECT COUNT(*) AS total_products FROM LAPTOP_GAMING');
        const recentActivitiesResult = await connection.execute('SELECT user_name, action from AUDIT_LOG');
        const recentActivities = recentActivitiesResult.rows.map(row => ({
            userName: row[0],
            action: row[1]
        }));
        return {           
                totalCustomers: customersResult.rows[0][0],
                totalProducts: productsResult.rows[0][0],
                recentAction: recentActivities         
        }
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
async function AddProduct(model, cpu, gpu, ram, storage, screenSize, resolution, price, img, img1, img2, img3, manufacturer) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute('INSERT INTO LAPTOP_GAMING (MODEL, CPU, GPU, RAM, STORAGE, SCREEN_SIZE, RESOLUTION, PRICE, IMG, IMG1, IMG2, IMG3, MANUFACTURER) VALUES (:model, :cpu, :gpu, :ram, :storage, :screenSize, :resolution, :price, :img, :img1, :img2, :img3, :manufacturer)', 
        { model, cpu, gpu, ram, storage, screenSize, resolution, price, img, img1, img2, img3, manufacturer });
      await connection.commit();
    
      // Giải phóng kết nối
      await connection.close();
    
      return { message: 'Sản phẩm đã được thêm thành công.' };
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      throw error;
    }
  }
  async function EditProduct(id, model, cpu, gpu, ram, storage, screenSize, resolution, price, img, img1, img2, img3, manufacturer) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `UPDATE LAPTOP_GAMING 
            SET MODEL = :model, 
                CPU = :cpu, 
                GPU = :gpu, 
                RAM = :ram, 
                STORAGE = :storage, 
                SCREEN_SIZE = :screenSize, 
                RESOLUTION = :resolution, 
                PRICE = :price, 
                IMG = :img, 
                IMG1 = :img1, 
                IMG2 = :img2, 
                IMG3 = :img3, 
                MANUFACTURER = :manufacturer 
            WHERE ID = :id`, 
            { id, model, cpu, gpu, ram, storage, screenSize, resolution, price, img, img1, img2, img3, manufacturer }
        );
        await connection.commit();

        // Giải phóng kết nối
        await connection.close();

        return { message: 'Sản phẩm đã được cập nhật thành công.' };
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        throw error;
    }
}
async function DeleteProducts(id) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn xóa sản phẩm dựa trên cartId
        const result = await connection.execute('DELETE FROM LAPTOP_GAMING WHERE Id = :Id', [id]);
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
async function queryUser() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT * FROM users WHERE role = :role', ['USER']);
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
async function DeleteUsers(id) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn xóa sản phẩm dựa trên cartId
        const result = await connection.execute('DELETE FROM users WHERE USER_Id = :Id', [id]);
        await connection.commit(); // Commit transaction
        await connection.close(); // Đóng kết nối
        return { message: 'Xóa Users thành công.' };

        // Kiểm tra số lượng hàng bị ảnh hưởng
      
    } catch (error) {
        console.log('Lỗi khi xóa Userss:', error);
        // Có thể thêm xử lý lỗi khác tại đây, ví dụ: ghi log, báo lỗi, vv.
        return { message: 'Đã xảy ra lỗi khi xóa User.' };
    }
}


module.exports = {AdminDashboard, AddProduct, EditProduct, DeleteProducts, queryUser, DeleteUsers};