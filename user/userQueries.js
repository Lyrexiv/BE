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
  async function checkLogin(username, password) {
    let connection;
    try {
        // Kết nối vào Oracle
        connection = await oracledb.getConnection(dbConfig);
        
        // Thực hiện truy vấn SELECT trên bảng người dùng, kiểm tra tên người dùng và mật khẩu
        const result = await connection.execute('SELECT * FROM users WHERE USERNAME = :username AND PASSWORD = :password', [username, password]);
        
        // Kiểm tra kết quả trả về từ truy vấn
        if (result.rows.length > 0) {
            // Nếu có kết quả trả về, tạo một đối tượng JSON để biểu thị việc đăng nhập thành công
            return { success: true, user: result.rows[0] };
        } else {
            // Nếu không có kết quả trả về, trả về một đối tượng JSON để biểu thị việc đăng nhập không thành công
            return { success: false, message: "Tên người dùng hoặc mật khẩu không đúng." };
        }
    } catch (err) {
        // Nếu có lỗi, ném ra lỗi để xử lý ở phần gọi hàm
        throw err;
    } finally {
        // Đóng kết nối
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Lỗi khi đóng kết nối:', err);
            }
        }
    }
}

// Hàm để lấy thông tin người dùng từ username
async function getUserInfoByUser_ID(userid) {
    let connection;
    try {
        // Kết nối vào Oracle
        connection = await oracledb.getConnection(dbConfig);
        
        // Thực hiện truy vấn SELECT trên bảng người dùng dựa trên tên người dùng
        const result = await connection.execute('SELECT * FROM users WHERE USER_ID = :userid', [userid]);
        
        // Trả về thông tin người dùng
        return result.rows[0];
    } finally {
        // Đóng kết nối
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Lỗi khi đóng kết nối:', err);
            }
        }
    }
}
async function queryUserById(userId) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT * FROM users WHERE USER_ID = :userId', [userId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        }
    }
}

async function registerUser(username, password, role = 'USER') {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
      
        // Thực hiện truy vấn để kiểm tra xem tên người dùng đã tồn tại chưa
        const result = await connection.execute('SELECT COUNT(*) AS count FROM users WHERE USERNAME= :username', [username]);
        if (result.rows[0].COUNT > 0) {
            throw new Error('Tên người dùng đã tồn tại.');
        }
      
     
          // Thực hiện truy vấn để chèn người dùng mới vào cơ sở dữ liệu với vai trò mặc định là 'user'
          const currentDate = new Date(); // Lấy thời gian hiện tại
          await connection.execute('INSERT INTO USERS (USERNAME, PASSWORD, ROLE, DATE_REGISTERED) VALUES (:username, :password, :role, :dateRegistered)', 
                                   { username, password, role, dateRegistered: currentDate });
        
        // Commit transaction
        await connection.commit();
      
        // Giải phóng kết nối
        await connection.close();
      
        return { message: 'Tài khoản đã được tạo thành công.' };
    } catch (error) {
        console.error('Lỗi khi đăng ký tài khoản:', error);
        throw error;
    }
}
async function EditUser(userId, fullName, email, dateOfBirth, address) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `UPDATE users 
            SET FULL_NAME = :fullName, 
                EMAIL = :email, 
                DATE_OF_BIRTH = :dateOfBirth, 
                ADDRESS = :address
            WHERE USER_ID = :userId`, 
            { userId, fullName, email, dateOfBirth, address }
        );
        await connection.commit();

        // Giải phóng kết nối
        await connection.close();

        return { message: 'Thông tin người dùng đã được cập nhật thành công.' };
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        throw error;
    }
}   
async function EditUser(userId, fullName, email, address) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `UPDATE users 
            SET FULL_NAME = :fullName, 
                EMAIL = :email, 
                ADDRESS = :address
            WHERE USER_ID = :userId`, 
            { userId, fullName, email, address }
        );
        await connection.commit();

        // Giải phóng kết nối
        await connection.close();

        return { message: 'Thông tin người dùng đã được cập nhật thành công.' };
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        throw error;
    }
}

module.exports = { checkLogin, getUserInfoByUser_ID, registerUser, queryUserById, EditUser};
