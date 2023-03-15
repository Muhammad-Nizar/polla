const { rpc, api } = require('./connect');
const { RpcError } = require('eosjs');
const crypto = require("crypto");

async function _tableInfo(table, reverse = true, limit = 100, lower_bound = null, upper_bound = null, index_position = null, idx_type = null, scope = 'qwpokn12345r') {
    var confg = {
        json: true, // Get the response as json
        code: 'qwpokn12345r', // Contract that we target
        scope: scope, // Account that owns the data
        table: table, // Table name
        reverse: reverse, //reverse, // Optional: Get reversed data
        //show_payer: true, // Optional: Show ram payer 
    };

    if (limit) {
        confg['limit'] = limit;
    }
    if (index_position != null) {
        confg['index_position'] = index_position;
    }
    if (idx_type != null) {
        confg['key_type'] = idx_type;
        if (idx_type == 'sha256') {
            if (upper_bound != null) {
                upper_bound = crypto.createHash('sha256').update(upper_bound).digest('hex');
            }
            if (lower_bound != null) {
                lower_bound = crypto.createHash('sha256').update(lower_bound).digest('hex');
            }
        }
    } else {
        confg['key_type'] = "i128";
    }
    if (upper_bound != null) {
        confg['upper_bound'] = upper_bound;
    }
    if (lower_bound != null) {
        confg['lower_bound'] = lower_bound;
    }
    try {
        console.log('confg', confg);
        return await rpc.get_table_rows(confg);
    } catch (e) {
        console.log('\nCaught exception: ' + e);
        if (e instanceof RpcError)
            console.log(JSON.stringify(e.json, null, 2));
    }
}


module.exports.table_page = _tableInfo;