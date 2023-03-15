const apiResponse = require("../utilities/response");
const { table_page } = require("../utilities/blockchain/listing_tables");
const { transaction } = require("../utilities/blockchain/transaction");
const env = require("../config/env");
const { mit } = require("../config/const");
const { create_token } = require("../utilities/session");
const limit = 2;

exports.get_list = async function(req, res) {
    var v = await table_page(
        mit.owners,
        req.query.sort != "asc",
        limit,
        req.query.sort == "asc" && req.query.start ? req.query.start : 0,
        req.query.sort != "asc" && req.query.start ? req.query.start : null
    );
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};

exports.get_details = async function(req, res) {
    var v = await table_page(mit.owners, true, 1, req.params.id, req.params.id);
    if (v.rows.length > 0) {
        res.set(env.customHeaders).status(200).json(apiResponse(v.rows[0], 1));
    } else {
        return res
            .set(env.customHeaders)
            .status(404)
            .send(apiResponse(null, 41, true, "Not found"));
    }
};

exports.post = async function(req, res) {
    const args = {
        plan_id: req.body.plan_id,
        owner_name: req.body.owner_name,
        description: req.body.description,
        logo: req.body.logo,
        default_lang: req.body.default_lang,
        account_uuid: req.body.account_uuid,
    };
    var v = await transaction("addowner", args);
    if (v.res) {
        const token = create_token("owner", req.body.account_uuid, v.affected_id);
        v.token = token;
    }
    res
        .set(env.customHeaders)
        .status(v.res ? 200 : 400)
        .json(v.res ? apiResponse(v, 1) : apiResponse(v, 41, true, v.msg));
};

exports.put = async function(req, res) {
    if (req.header["miid"] != req.body.owner_id) {
        res
            .set(env.customHeaders)
            .status(401)
            .json(apiResponse({}, 10, true, "Auth failed"));
        return;
    }
    const args = {
        owner_id: req.body.owner_id,
        plan_id: req.body.plan_id,
        description: req.body.description,
        logo: req.body.logo,
    };
    var v = await transaction("edtowner", args);
    v.affected_id = req.body.owner_id;
    res
        .set(env.customHeaders)
        .status(v.res ? 200 : 400)
        .json(v.res ? apiResponse(v, 1) : apiResponse(v, 41, true, v.msg));
};

exports.delete = async function(req, res) {
    const args = {
        owner_id: req.body.owner_id,
    };
    var v = await transaction("rmowner", args);
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};