const apiResponse = require('../utilities/response');
const { table_page } = require('../utilities/blockchain/listing_tables');
const { transaction } = require('../utilities/blockchain/transaction');
const env = require('../config/env');
const { mit } = require('../config/const');
const limit = 5;

exports.get_list = async function(req, res) {
    var v = await table_page(mit.plans,
        req.query.sort != "asc",
        limit,
        req.query.sort == "asc" && req.query.start ? req.query.start : 0,
        req.query.sort != "asc" && req.query.start ? req.query.start : null);
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
}

exports.get_details = async function(req, res) {

    var v = await table_page(mit.plans, true, 1, req.params.id, req.params.id);
    res.set(env.customHeaders).status(200).json(apiResponse(v.rows[0], 1));
}

exports.post = async function(req, res) {
    const args = {
        plan_name: req.body.plan_name,
    }
    var v = await transaction("addplan", args);
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
}

exports.put = async function(req, res) {
    const args = {
        plan_name: req.body.plan_name,
        plan_id: req.body.plan_id,
    }
    var v = await transaction("edtplan", args);
    v.affected_id = req.body.plan_id;
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
}

// exports.delete = async function(req, res) {
//     var v = await transaction("rmpolicy", args);
//     res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
// }