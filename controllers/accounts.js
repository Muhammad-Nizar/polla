const apiResponse = require('../utilities/response');
const { table_page } = require('../utilities/blockchain/listing_tables');
const { create_token } = require('../utilities/session');
const env = require('../config/env');
const { mit } = require('../config/const');


exports.auth_owner = async function(req, res) {
    const account_uuid = req.body.account_uuid;
    const record = await table_page(mit.owners, true, 1, account_uuid, account_uuid, 4, "sha256");
    if (record.rows.length) {
        const token = create_token("owner", account_uuid, record.rows[0].id);
        res.set(env.customHeaders).status(200).json(apiResponse({ token: token, record: record.rows[0] }, 1));
    } else {
        return res.set(env.customHeaders).status(401).send(apiResponse(null, 41, true, 'Not valid user id'));

    }
}

// exports.auth_user = async function(req, res) {
//     const account_uuid = req.body.account_uuid;
//     var record = await table_page('owner.a', true, 1, account_uuid, account_uuid);
//     const token = create_token("user", account_uuid);

//     res.set(env.customHeaders).status(200).json(apiResponse({ token: token }, 1));
// }

//TODO logout