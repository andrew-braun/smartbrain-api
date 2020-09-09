const bcrypt = require('bcrypt')

const hashPassword = (password) => {
    bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
            throw err
        }
        console.log(hash)
    });
}

const comparePassword = (password, hash) => {
    bcrypt.compare(password, hash, function(err, result) {
        if (err) {
            throw err
        }
        console.log(result)
    });
};

exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;