import jwt from 'jsonwebtoken';

export const signAccess = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'supersecretaccess', {
    expiresIn: '15m',
  });
};

export const signRefresh = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || 'supersecretrefresh', {
    expiresIn: '7d',
  });
};

export const verifyAccess = (token) =>
  jwt.verify(token, process.env.JWT_SECRET || 'supersecretaccess');

export const verifyRefresh = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'supersecretrefresh');