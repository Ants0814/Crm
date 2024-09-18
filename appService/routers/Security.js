const crypto = require('crypto');

function createKeyAndIV(key) {
    const keyBytes = Buffer.from(key, 'utf8');
    const paddedKey = Buffer.alloc(16, 0); // 16바이트 길이의 버퍼를 생성하고 0으로 초기화
    keyBytes.copy(paddedKey, 0, 0, Math.min(keyBytes.length, 16)); // 키 바이트를 복사하여 길이를 16바이트로 조정
    return paddedKey;
}

function encrypt(textToEncrypt, key) {
    const keyIV = createKeyAndIV(key);
    const cipher = crypto.createCipheriv('aes-128-cbc', keyIV, keyIV);
    let encrypted = cipher.update(textToEncrypt, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decrypt(textToDecrypt, key) {
    const keyIV = createKeyAndIV(key);
    const decipher = crypto.createDecipheriv('aes-128-cbc', keyIV, keyIV);
    let decrypted = decipher.update(textToDecrypt, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// 사용 예시
const key = 'ANTS';
const encryptedData = encrypt('Hello, World!', key);
const decryptedData = decrypt(encryptedData, key);

console.log('Encrypted:', encryptedData);
console.log('Decrypted:', decryptedData);

module.exports = { encrypt, decrypt };