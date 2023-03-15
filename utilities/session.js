const crypto = require('crypto')
var { mysqlPlanetScale } = require('../utilities/database');
const { v4 } = require('uuid');


exports.create_token = function(type, account_uuid, miid) {
    const stamp = Math.floor(Date.now() / 1000);
    let token = crypto.createHash('md5').update(v4()).digest("hex");
    mysqlPlanetScale.query('INSERT INTO `polauth` (`stamp`, token, type, uuid, miid) VALUES (' + stamp + ', "' + token + '", "' + type + '", "' + account_uuid + '", "' + miid + '")');
    return token;
}