const fs = require('fs');
const path = require('path');
module.exports = function (data, FilePath) {
    let content = JSON.stringify(data);
    let file = path.join(__dirname, FilePath);
    fs.writeFile(file, content, err => {
        if (err) {
            throw err;
        }
    })
}