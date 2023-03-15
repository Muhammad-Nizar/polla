const apiResponse = require("../utilities/response");
const { table_page } = require("../utilities/blockchain/listing_tables");
const { transaction } = require("../utilities/blockchain/transaction");
const crypto = require("crypto");
const { pinataUpload, bodying } = require("../utilities/helpers");
const { mit } = require("../config/const");
const env = require("../config/env");
const limit = 10;

exports.get_list = async function(req, res) {
    var v = await table_page(
        mit.bodies,
        req.query.sort != "asc",
        limit,
        req.query.sort == "asc" && req.query.start ? req.query.start : 0,
        req.query.sort != "asc" && req.query.start ? req.query.start : null
    );
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};

exports.get_details = async function(req, res) {
    var v = await table_page(mit.bodies, true, 1, req.params.id, req.params.id);
    if (v.rows.length == 0) {
        res
            .set(env.customHeaders)
            .status(404)
            .send(apiResponse(null, 41, true, "Not found"));
    } else {
        var body = await bodying(v.rows[0], req, true);
        if (!body) {
            res
                .set(env.customHeaders)
                .status(409)
                .send(apiResponse(null, 41, true, "Invalid hash check"));
        } else {
            res.set(env.customHeaders).status(200).json(apiResponse(body, 1));
        }
    }
};

exports.post = async function(req, res) {
    var domain = null;
    var domains = await table_page(
        mit.domains,
        true,
        1,
        req.body.domain_id,
        req.body.domain_id
    );
    if (domains.rows.length > 0) {
        domain = domains.rows[0];
    }

    const body = req.body.html;

    const fs = require("fs");
    const stamp = Math.floor(Date.now() / 1000);
    const fname =
        "./policies/" +
        domain.url
        .replace("http://", "")
        .replace("https://", "")
        .replace("www.", "")
        .replace("/", "") +
        "_" +
        stamp +
        ".html";
    fs.writeFileSync(fname, body);

    const data = fs.ReadStream(fname, "utf8");
    const pinataHash = await pinataUpload(data);
    var hash = crypto.createHash("sha512").update(body).digest("hex");

    const args = {
        owner_id: req.body.owner_id,
        polla_id: req.body.polla_id,
        commit_msg: req.body.commit_msg,
        lang: req.body.lang,
        hash: hash,
        ipfs_link: "https://gateway.pinata.cloud/ipfs/" + pinataHash,
        basic: 0,
    };
    var v = await transaction("addpollatxt", args);
    if (v.res) {
        v.hash = hash;
        v.ipfs_link = "https://gateway.pinata.cloud/ipfs/" + pinataHash;
    }
    res
        .set(env.customHeaders)
        .status(v.res ? 200 : 400)
        .json(v.res ? apiResponse(v, 1) : apiResponse(v, 41, true, v.msg));
};

exports.put = async function(req, res) {
    var domain = null;
    var domains = await table_page(
        mit.domains,
        true,
        1,
        req.body.domain_id,
        req.body.domain_id
    );
    if (domains.rows.length > 0) {
        domain = domains.rows[0];
    }

    const body = req.body.html;

    const fs = require("fs");
    const stamp = Math.floor(Date.now() / 1000);
    const fname =
        "./policies/" +
        domain.url
        .replace("http://", "")
        .replace("https://", "")
        .replace("www.", "")
        .replace("/", "") +
        "_" +
        stamp +
        ".html";
    fs.writeFileSync(fname, body);

    const data = fs.ReadStream(fname, "utf8");
    const pinataHash = await pinataUpload(data);
    var hash = crypto.createHash("sha512").update(body).digest("hex");

    const args = {
        body_id: req.body.body_id,
        owner_id: req.body.owner_id,
        commit_msg: req.body.commit_msg,
        hash: hash,
        ipfs_link: "https://gateway.pinata.cloud/ipfs/" + pinataHash,
    };
    var v = await transaction("edtpollatxt", args);
    if (v.res) {
        const t = v.affected_id.split("-");
        const version = t[0];
        const body_id = t[1];
        v.hash = hash;
        v.ipfs_link = "https://gateway.pinata.cloud/ipfs/" + pinataHash;
        v.version = version;
        v.affected_id = body_id;
    }
    res
        .set(env.customHeaders)
        .status(v.res ? 200 : 400)
        .json(v.res ? apiResponse(v, 1) : apiResponse(v, 41, true, v.msg));
};