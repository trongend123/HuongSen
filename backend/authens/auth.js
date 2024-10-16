import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import Staffs from '../models/staff.js';
const users = Staffs; // Dummy users array for testing purposes

// Function to handle user registration
export async function registerUser(req, res, next) {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(createError.InternalServerError(error.message));
  }
}

// Function to handle user login and generate tokens
export async function loginUser(req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await users.findOne({ username });
    if (!user) return next(createError.Unauthorized("User not found"));

    // Check the password without hashing
    if (password !== user.password) {
      return next(createError.Unauthorized("Invalid credentials"));
    }
    
    const accessToken = await signAccessToken(username);
    const refreshToken = await signRefreshToken(username);
    
    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    next(createError.InternalServerError(error.message));
  }
}

// Function to change user password
// export async function changePassword(req, res, next) {
//   const { currentPassword, newPassword } = req.body;
//   const _id = req.params; // Get username from token payload

//   try {
//     const user = await users.findOne({ _id });
//     if (!user) return next(createError.Unauthorized("User not found"));
//     console.log('user', user);
//     // Check if the current password matches
//     if (currentPassword !== user.password) {
//       return next(createError.Unauthorized("Current password is incorrect"));
//     }

//     // Change password without hashing the new one
//     user.password = newPassword; // Update the password
//     res.json({ message: 'Password changed successfully' });
//   } catch (error) {
//     next(createError.InternalServerError(error.message));
//   }
// }

// Sign access token function
async function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = { username: userId }; // Include username in the payload
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '3h',
      issuer: 'localhost:9999',
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

// Sign refresh token function
async function signRefreshToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
      issuer: 'localhost:9999',
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
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