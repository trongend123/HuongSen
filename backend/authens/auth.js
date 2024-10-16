import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import Staffs from '../models/staff.js';
const users = Staffs; // Dummy users array for testing purposes

// Function to handle user registration (can be extended with DB integration)
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
  

    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword)
    //   return next(createError.Unauthorized("Invalid credentials"));

    const accessToken = await signAccessToken(username);
    const refreshToken = await signRefreshToken(username);
    
    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    next(createError.InternalServerError(error.message));
  }
}

// Sign access token function
async function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};
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
      const message =
        err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
}
