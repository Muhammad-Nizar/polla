var { mysql_planetscale_config } = require('../config/db.js');

const mysql = require('mysql')
const mysqlPlanetScale = mysql.createConnection('mysql://' + mysql_planetscale_config.user + ':' + mysql_planetscale_config.password + '@' + mysql_planetscale_config.host + '/' + mysql_planetscale_config.database + '?ssl={"rejectUnauthorized":true}')

module.exports.mysqlPlanetScale = mysqlPlanetScale;