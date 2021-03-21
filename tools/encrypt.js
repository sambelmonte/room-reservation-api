import bcrypt from 'bcrypt';
import crypto from 'crypto';

// for password
const saltRounds = 10;

// for securekey
const algorithm = 'aes-256-ctr';
const secretKey = 'sk2jasNUID45NkjaFsnsd83Kkds84ja4';
const iv = '237f306841bd23a418878792252ff6c8';

export function generateHash(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds).then((hash) => resolve(hash))
  });
}

export function checkPassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash).then((result) => resolve(result))
  });
}

export function encryptKey(userId, username) {
  // Key will expire after 24 hours
  const expiry = Date.now() + (24*60*60*1000);
  const text = `${userId}:|:${username}:|:${expiry}`;

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return encrypted.toString('hex');
}

export function decryptKey(key) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(key, 'hex')), decipher.final()]);
  const keyData = decrpyted.toString().split(':|:');
  return {
    userId: keyData[0],
    username: keyData[1],
    expiry: keyData[2]
  };
}
