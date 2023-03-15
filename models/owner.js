const { tbls } = require('../schemas/config');
const { table_page } = require('../utilities/blockchain/listing_tables');
var { mysqlPlanetScale } = require('../utilities/database');
const crypto = require("crypto");
const { v4 } = require('uuid');


const { transaction } = require('../utilities/blockchain/transaction');

const tbl = "owners";

async function findByAuthToken(token) {
    return await
    mysqlPlanetScale.oneOrNone("SELECT * FROM " + tbl + " WHERE token = $1", token);
}

async function createRecord(owner) {
    var now = Math.floor(Date.now() / 1000);
    let uuid = v4();

    await mysqlPlanetScale.none('INSERT INTO ' + tbl + '(created_at, uuid, name) VALUES ($1, $2, $3, $4)', [now, uuid, owner.name]);

    return token;
}

async function createSessionDBToken(auth, uuid) {
    var now = Math.floor(Date.now() / 1000);
    var token = crypto.createHash('sha256').update(auth + now).digest('hex');

    await mysqlPlanetScale.none("DELETE FROM " + tbl + " WHERE uuid = '" + uuid + "' ");
    await mysqlPlanetScale.none('INSERT INTO ' + tbl + '(created_at, token, uuid) VALUES ($1, $2, $3, $4)', [now, token, uuid, true]);

    return token;
}

async function getAccountValues(actor) {
    var x = await transaction("accval", {
        acc: actor
    });
    return x.split("_");
}

async function login(auth) {
    var t = auth.split("@");
    var actor = t[0];

    if (true) {
        var vals = await getAccountValues(actor);
        var accountVal = vals[0];
        var accountValP = vals[1];
        var shop = await table_page(tbls.shop, true, 1, accountVal, accountVal, 3);
        var token = await createSessionDBToken(auth, shop.rows[0]);
        return {
            token: token,
            accountVal: accountVal,
            accountValP: accountValP,
            shop: {
                data: shop.rows,
                more: false,
                next_key: '',
            }

        }
    } else {
        return null
    }
};


module.exports.findByAuthToken = findByAuthToken;
module.exports.login = login;