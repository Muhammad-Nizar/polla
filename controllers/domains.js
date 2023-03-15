const apiResponse = require("../utilities/response");
const { table_page } = require("../utilities/blockchain/listing_tables");
const { transaction } = require("../utilities/blockchain/transaction");
const env = require("../config/env");
var { mysqlPlanetScale } = require("../utilities/database");
const { v4 } = require("uuid");
const { mit } = require("../config/const");
const { curly } = require("node-libcurl");
const limit = 10;

exports.get_list = async function(req, res) {
    var owner_id = req.query.owner_id;
    var v = null;
    if (!owner_id) {
        v = await table_page(
            mit.domains,
            req.query.sort != "asc",
            limit,
            req.query.sort == "asc" && req.query.start ? req.query.start : 0,
            req.query.sort != "asc" && req.query.start ? req.query.start : null
        );
    } else {
        v = await table_page(
            mit.domains,
            req.query.sort != "asc",
            9999,
            owner_id,
            owner_id,
            2
        );
    }

    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};

exports.get_details = async function(req, res) {
    var v = await table_page(mit.domains, true, 1, req.params.id, req.params.id);
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
    try {
        const { statusCode } = await curly.get(req.body.url, {
            NOBODY: true,
            FOLLOWLOCATION: true,
            SSL_VERIFYHOST: false,
            SSL_VERIFYPEER: false,
        });
        if (statusCode != 200) {
            res
                .set(env.customHeaders)
                .status(400)
                .json(apiResponse({}, 10, true, "domain http code " + statusCode));
            return;
        }
    } catch (e) {
        console.log(e)
        res.set(env.customHeaders).status(400).json(apiResponse({}, 10, true, e));
        return;
    }

    let vcode = v4();
    if (req.header["miid"] != req.body.owner_id) {
        res
            .set(env.customHeaders)
            .status(401)
            .json(apiResponse({}, 10, true, "Auth failed"));
        return;
    }
    const args = {
        owner_id: req.body.owner_id,
        url: req.body.url,
        verification_code: vcode,
    };
    var v = await transaction("adddomain", args);
    if (!v.error) {
        const fs = require("fs");
        if (!fs.existsSync("./verdom/" + vcode)) {
            fs.mkdirSync("./verdom/" + vcode);
        }

        const stamp = Math.floor(Date.now() / 1000);
        //const fname = req.body.url.replace('http://', '').replace('https://', '').replace('www.', '').replace('/', '') + '_policy.ver';
        const fname = "policy.ver";
        fs.writeFileSync(
            "./verdom/" + vcode + "/" + fname,
            '{"domain":"' +
            req.body.url +
            '", "verification":"' +
            vcode +
            '","stamp":' +
            stamp +
            "}"
        );
        mysqlPlanetScale.query(
            "INSERT INTO `verdom` (`stamp`, domain, vcode) VALUES (" +
            stamp +
            ', "' +
            req.body.url +
            '", "' +
            vcode +
            '")'
        );

        v.vcode = vcode;
        v.download = req.headers.host + "/" + vcode + "/" + fname;
        v.fetch = req.body.url + "/" + fname;
    }
    res
        .set(env.customHeaders)
        .status(v.res ? 200 : 400)
        .json(v.res ? apiResponse(v, 1) : apiResponse(v, 41, true, v.msg));
};

exports.put = async function(req, res) {
    const verification_code = req.body.vcode;
    const domain = req.body.domain;
    //TODO cleaner
    const dbres = await mysqlPlanetScale.query(
        'SELECT * FROM `verdom` WHERE domain = "' +
        domain +
        '" AND vcode = "' +
        verification_code +
        '" LIMIT 1)'
    );
    const args = {
        owner_id: req.body.owner_id,
        domain_id: req.body.domain_id,
    };
    var v = await transaction("verdomain", args);
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};

exports.verfile = async function(req, res) {
    try {
        const { statusCode, data } = await curly.get(
            req.body.url, {
                FOLLOWLOCATION: true,
                SSL_VERIFYHOST: false,
                SSL_VERIFYPEER: false,
            }
        );
        if (statusCode != 200) {
            res
                .set(env.customHeaders)
                .status(400)
                .json(
                    apiResponse({ statusCode: statusCode },
                        10,
                        true,
                        "domain http code " + statusCode
                    )
                );
            return;
        }

        const fileData = JSON.parse(data.toString());
        const verification = fileData.verification;
        const args = {
            owner_id: req.body.owner_id,
            domain_id: req.body.domain_id,
            verification_code: verification,
        };
        v = await transaction("verdomain", args);
        v.affected_id = req.body.domain_id;
        res
            .set(env.customHeaders)
            .status(v.res ? 200 : 400)
            .json(v.res ? apiResponse(v, 1) : apiResponse(v, 41, true, v.msg));
    } catch (e) {
        console.log(e);
        res
            .set(env.customHeaders)
            .status(400)
            .json(apiResponse({ e: e }, 10, true, e));
        return;
    }
};

exports.delete = async function(req, res) {
    const args = {
        owner_id: req.body.owner_id,
        domain_id: req.body.domain_id,
    };
    var v = await transaction("rmdomain", args);
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};