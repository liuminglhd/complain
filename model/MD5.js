//封装md5加密
const crypto = require("crypto");
function _md5(firstPwd){
    const md5 = crypto.createHash("md5");
    return md5.update(firstPwd).digest("base64");
}
module.exports = function(pwd){
    return _md5(_md5(pwd).substr(10,10)+_md5("lm"));
};