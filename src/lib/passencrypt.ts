const bcrypt = require('bcrypt');

export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}