const bcrypt = require('bcrypt');
const crypto = require('crypto');

// for password
const saltRounds = 10;

// for securekey
const algorithm = 'aes-256-ctr';
const secretKey = 'sk2jasNUID45NkjaFsnsd83Kkds84ja4';
const iv = '237f306841bd23a418878792252ff6c8';

function generateHash(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds).then((hash) => resolve(hash))
  });
}

function checkPassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash).then((result) => resolve(result))
  });
}

function encryptKey(userId, username, isAdmin = false) {
  const separator = isAdmin? '!|!': ':|:';
  // Key will expire after 24 hours
  const expiry = Date.now() + (24*60*60*1000);
  const text = [userId, username, expiry].join(separator);

  const cipher = crypto.createCipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return encrypted.toString('hex');
}

function decryptKey(key, isAdmin = false) {
  const separator = isAdmin? '!|!': ':|:';
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(key, 'hex')), decipher.final()]);
  const keyData = decrpyted.toString().split(separator);
  return {
    userId: keyData[0],
    expiry: keyData[1],
    username: keyData[2]
  };
}

module.exports = {
  checkPassword,
  decryptKey,
  encryptKey,
  generateHash
};