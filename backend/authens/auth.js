import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import Staffs from '../models/staff.js';
const users = Staffs; // Dummy users array for testing purposes


// export async function registerUser(req, res, next) {
//   const { username, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     users.push({ username, password: hashedPassword });
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     next(createError.InternalServerError(error.message));
//   }
// }

export async function registerUser(req, res, next) {
  const { username, password, fullname, email, phone, role } = req.body;

  // // Kiểm tra bắt buộc: username và password
  // if (!username || username.trim().length < 3 || username.trim().length > 30) {
  //   return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
  // }
  // if (!password || password.length < 6) {
  //   return res.status(400).json({ message: 'Password must be at least 6 characters' });
  // }

  // // Kiểm tra các trường không bắt buộc
  // if (fullname && fullname.trim().length < 3) {
  //   return res.status(400).json({ message: 'Fullname must be at least 3 characters' });
  // }
  // if (email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
  //   return res.status(400).json({ message: 'Invalid email format' });
  // }
  // if (phone && !/^\d{10,15}$/.test(phone)) {
  //   return res.status(400).json({ message: 'Phone must be a valid number with 10 to 15 digits' });
  // }
  // if (role && !['admin', 'staff_mk', 'staff_ds', 'staff_cb', 'staff'].includes(role)) {
  //   return res.status(400).json({ message: 'Invalid role value. Allowed values are: admin, staff_mk, staff_ds, staff_cb, staff' });
  // }

  // // Kiểm tra bắt buộc: username và password
  // if (!username || !password) {
  //   return res.status(400).json({ message: 'Username and password are required' });
  // }

  try {
    // // Kiểm tra username đã tồn tại
    // const existingUser = await users.findOne({ username });
    // if (existingUser) {
    //   return res.status(409).json({ message: 'Username already exists' });
    // }

    // // Validate email nếu được cung cấp
    // if (email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    //   return res.status(400).json({ message: 'Invalid email format' });
    // }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new users({
      username,
      password: hashedPassword,
      fullname: fullname || undefined, // Bỏ qua nếu không có fullname
      email: email || undefined,       // Bỏ qua nếu không có email
      phone: phone || undefined,       // Bỏ qua nếu không có phone
      role: role || 'staff',           // Gán giá trị mặc định nếu không có role
    });

    // Lưu người dùng
    await newUser.save();
    console.log('User saved successfully:', newUser);
    // Phản hồi thành công
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    if (error.code === 11000 && error.keyValue.username) {
      // Xử lý lỗi unique key
      // const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(409).json({ message: 'Tên người dùng đã tồn tại' });
    }

    // Xử lý các lỗi khác
    next(createError.InternalServerError(error.message));
  }
}

// Function to handle user login and generate tokens
// export async function loginUser(req, res, next) {
//   const { username, password } = req.body;

//   try {
//     const user = await users.findOne({ username });
//     if (!user) return next(createError.Unauthorized("User not found"));



//     // const isValidPassword = await bcrypt.compare(password, user.password);
//     // if (!isValidPassword)
//     //   return next(createError.Unauthorized("Invalid credentials"));
//     if (password !== user.password) {
//       return next(createError.Unauthorized("Invalid credentials"));
//     }
//     const accessToken = await signAccessToken(username);
//     const refreshToken = await signRefreshToken(username);

//     res.json({ accessToken, refreshToken, user });

//   } catch (error) {
//     next(createError.InternalServerError(error.message));
//   }
// }


export async function loginUser(req, res) {
  let { username, password } = req.body;

  try {
    // Kiểm tra username và password có tồn tại
    if (!username || !password) {
      return res.status(400).json({ message: 'Username và password bắt buộc' });
    }

    // Loại bỏ khoảng trắng thừa
    username = username.trim();
    password = password.trim();

    // Tìm user trong cơ sở dữ liệu
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Tên người dùng hoặc mật khẩu không hợp lệ' });
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Tên người dùng hoặc mật khẩu không hợp lệ' });
    }

    // Tạo access token và refresh token
    const accessToken = await signAccessToken(user._id.toString()); // Truyền `user._id` thay vì `username`
    const refreshToken = await signRefreshToken(user._id.toString());

    // Trả về token và thông tin người dùng
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}


// Function to change user password using ID
// export async function changePassword(req, res, next) {
//   const { currentPassword, newPassword } = req.body;
//   const userId = req.payload.id; // Get the user ID from the token payload

//   try {
//     const user = await users.findById(userId); // Find the user by ID
//     if (!user) return next(createError.Unauthorized("User not found"));

//     const isValidPassword = await bcrypt.compare(currentPassword, user.password);
//     if (!isValidPassword) return next(createError.Unauthorized("Current password is incorrect"));

//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedNewPassword; // Update the password

//     // Save the updated user object to the database
//     await user.save();

//     res.json({ message: 'Password changed successfully' });
//   } catch (error) {
//     next(createError.InternalServerError(error.message));
//   }
// }
export async function changePassword(req, res, next) {
  const { username, currentPassword, newPassword } = req.body; // Lấy username từ body

  // Validate đầu vào
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({ message: 'Invalid username. It must be at least 3 characters long.' });
  }

  if (!currentPassword || typeof currentPassword !== 'string' || currentPassword.length < 6) {
    return res.status(400).json({ message: 'Invalid current password. It must be at least 6 characters long.' });
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ message: 'Invalid new password. It must be at least 6 characters long.' });
  }

  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await users.findOne({ username });
    if (!user) {
      return next(createError.Unauthorized('User not found'));
    }

    // Kiểm tra mật khẩu hiện tại có đúng không
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới và lưu vào cơ sở dữ liệu
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    next(createError.InternalServerError('Xẩy ra lỗi khi thay đổi mật khẩu.'));
  }
}

// Sign access token function
export async function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid userId provided for access token');
      return reject(createError.BadRequest('Invalid userId'));
    }

    const payload = { username: userId }; // Include username in the payload
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      console.error('ACCESS_TOKEN_SECRET is not defined in environment variables');
      return reject(createError.InternalServerError('Internal configuration error'));
    }

    const options = {
      expiresIn: '3h',
      issuer: 'localhost:9999',
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error('Error signing access token:', err.message);
        return reject(createError.InternalServerError('Failed to sign access token'));
      }
      resolve(token);
    });
  });
}

// Sign refresh token function
export async function signRefreshToken(userId) {
  return new Promise((resolve, reject) => {
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid userId provided for refresh token');
      return reject(createError.BadRequest('Invalid userId'));
    }

    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
      console.error('REFRESH_TOKEN_SECRET is not defined in environment variables');
      return reject(createError.InternalServerError('Internal configuration error'));
    }

    const options = {
      expiresIn: '1y',
      issuer: 'localhost:9999',
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error('Error signing refresh token:', err.message);
        return reject(createError.InternalServerError('Failed to sign refresh token'));
      }
      resolve(token);
    });
  });
}

// Middleware to verify access token
export function verifyAccessToken(req, res, next) {
  if (!req.headers['authorization']) return next(createError.Unauthorized());

  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload; // Attach the payload to the request
    next();
  });
}