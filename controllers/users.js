const apiResponse = require('../utilities/response');
const { table_page } = require('../utilities/blockchain/listing_tables');
const { transaction } = require('../utilities/blockchain/transaction');
const env = require('../config/env');
const limit = 10;
exports.get_list = async function(req, res) {
    var v = await table_page('user.a', true, limit, req.query.start ? req.query.start : 0);
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
}

exports.get_details = async function(req, res) {
    var v = await table_page('user.a', true, 1, req.params.id, req.params.id);
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
}

exports.post = async function(req, res) {
    const args = {
        account_uuid: req.body.account_uuid,
    }
    var v = await transaction("adduser", args);
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
}

exports.put = async function(req, res) {
    const args = {
        account_uuid: req.body.account_uuid,
    }
    var v = await transaction("edtuser", args);
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
}

exports.delete = async function(req, res) {
    const args = {
        account_uuid: req.body.account_uuid,
    }
    var v = await transaction("rmuser", args);
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
}