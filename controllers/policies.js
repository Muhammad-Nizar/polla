const apiResponse = require("../utilities/response");
const { table_page } = require("../utilities/blockchain/listing_tables");
const { transaction } = require("../utilities/blockchain/transaction");
const env = require("../config/env");
var { mysqlPlanetScale } = require("../utilities/database");
const crypto = require("crypto");
const { pinataUpload, bodying } = require("../utilities/helpers");
const { mit } = require("../config/const");
const { curly } = require("node-libcurl");
const limit = 10;

exports.rekey = async function (req, res) {
  const polla_id = req.body.polla_id;
  var v = await table_page(mit.policies, true, 1, polla_id, polla_id);
  if (v.rows.length == 0) {
    res
      .set(env.customHeaders)
      .status(404)
      .send(apiResponse(null, 41, true, "Not found"));
  } else {
    const crypto = require("crypto");
    const key = crypto.randomBytes(32);
    enckey = key.toString("hex");

    mysqlPlanetScale.query(
      'UPDATE `poldef` SET enckey = "' + enckey + '" WHERE id = ' + polla_id
    );
    res
      .set(env.customHeaders)
      .status(200)
      .json(apiResponse({ enckey: enckey }, 1));
  }
};

exports.get_list = async function (req, res) {
  // list all polocies OR under domain OR under owner
  var owner_id = req.query.owner;
  var domain_id = req.query.domain;
  var v = null;

  if (owner_id) {
    v = await table_page(
      mit.policies,
      req.query.sort != "asc",
      9999,
      owner_id,
      owner_id,
      4
    );
  } else if (domain_id) {
    v = await table_page(
      mit.policies,
      req.query.sort != "asc",
      9999,
      domain_id,
      domain_id,
      5
    );
  } else {
    v = await table_page(
      mit.policies,
      req.query.sort != "asc",
      limit,
      req.query.sort == "asc" && req.query.start ? req.query.start : 0,
      req.query.sort != "asc" && req.query.start ? req.query.start : null
    );
  }
  res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};

exports.get_details = async function (req, res) {
  var v = await table_page(mit.policies, true, 1, req.params.id, req.params.id);
  if (v.rows.length == 0) {
    res
      .set(env.customHeaders)
      .status(404)
      .send(apiResponse(null, 41, true, "Not found"));
  } else {
    const policy = v.rows[0];
    const full = req.query.full;
    const only_top = req.query.only_top;
    const version = req.query.version;
    const lang = req.query.lang;

    var bodies = {};

    if (only_top) {
      var _ = [];
      for (const idx in policy.bodies_list) {
        if (policy.bodies_list[idx].value.is_top) {
          _.push(policy.bodies_list[idx]);
        }
      }
      policy.bodies_list = _;
    }

    if (version) {
      var _ = [];
      for (const idx in policy.bodies_list) {
        if (policy.bodies_list[idx].value.version == version) {
          _.push(policy.bodies_list[idx]);
        }
      }
      policy.bodies_list = _;
    }

    if (lang) {
      var _ = [];
      for (const idx in policy.bodies_list) {
        if (policy.bodies_list[idx].value.lang == lang) {
          _.push(policy.bodies_list[idx]);
        }
      }
      policy.bodies_list = _;
    }

    if (full) {
      for (const idx in policy.bodies_list) {
        var _body = await bodying(policy.bodies_list[idx].value, req);
        //console.log(_body, policy.bodies_list[body_id].value)
        if (!_body) {
          // res
          //     .set(env.customHeaders)
          //     .status(409)
          //     .send(apiResponse(null, 41, true, "Invalid hash check"));
        } else {
          bodies[policy.bodies_list[idx].key] = _body;
        }
      }
    }

    policy.bodies = bodies;
    res.set(env.customHeaders).status(200).json(apiResponse(policy, 1));
  }
};

exports.post = async function (req, res) {
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
  const croule_urls = JSON.parse(req.body.croule_urls);
  const confirm_cb = req.body.confirm_cb;
  const notification_cb = req.body.notification_cb;

  if (confirm_cb) {
    try {
      const { statusCode } = await curly.get(confirm_cb, {
        NOBODY: true,
        FOLLOWLOCATION: true,
        SSL_VERIFYHOST: false,
        SSL_VERIFYPEER: false,
      });
      if (statusCode != 200) {
        res
          .set(env.customHeaders)
          .status(400)
          .json(
            apiResponse({}, 10, true, "confirm_cb http code " + statusCode)
          );
        return;
      }
      if (!confirm_cb.startsWith(domain.url)) {
        res
          .set(env.customHeaders)
          .status(400)
          .json(
            apiResponse(
              {},
              10,
              true,
              "confirm_cb does not belong to " + domain.url
            )
          );
        return;
      }
    } catch (e) {
      console.log(e);
      res
        .set(env.customHeaders)
        .status(400)
        .json(apiResponse({ confirm_cb: confirm_cb, e: e }, 10, true, e));
      return;
    }
  }
  if (notification_cb) {
    try {
      const { statusCode } = await curly.get(notification_cb, {
        NOBODY: true,
        FOLLOWLOCATION: true,
        SSL_VERIFYHOST: false,
        SSL_VERIFYPEER: false,
      });
      if (statusCode != 200) {
        res
          .set(env.customHeaders)
          .status(400)
          .json(
            apiResponse({}, 10, true, "notification_cb http code " + statusCode)
          );
        return;
      }
      if (!notification_cb.startsWith(domain.url)) {
        res
          .set(env.customHeaders)
          .status(400)
          .json(
            apiResponse(
              {},
              10,
              true,
              "notification_cb does not belong to " + domain.url
            )
          );
        return;
      }
    } catch (e) {
      console.log(e);
      res
        .set(env.customHeaders)
        .status(400)
        .json(apiResponse({ notification_cb: notification_cb }, 10, true, e));
      return;
    }
  }

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
    domain_id: req.body.domain_id,
    title: req.body.title,
    allow_approve: parseInt(req.body.allow_approve),
    allow_approve_per_version: parseInt(req.body.allow_approve_per_version),
    broadcast_update: parseInt(req.body.broadcast_update),
    hash: hash,
    ipfs_link: "https://gateway.pinata.cloud/ipfs/" + pinataHash,
  };
  var v = await transaction("addpolla", args);
  if (v.res) {
    const t = v.affected_id.split("-");
    const policy_id = t[0];
    const body_id = t[1];
    const crypto = require("crypto");
    const key = crypto.randomBytes(32);
    enckey = key.toString("hex");

    mysqlPlanetScale.query(
      'INSERT INTO `poldef` (owner_id, domain_id, policy_id, notification_cb, confirm_cb, croule_urls, enckey) VALUES ("' +
        req.body.owner_id +
        '","' +
        req.body.domain_id +
        '","' +
        policy_id +
        '","' +
        notification_cb +
        '","' +
        confirm_cb +
        '","' +
        croule_urls +
        '" , "' +
        enckey +
        '")'
    );
    v.policy_id = policy_id;
    v.body_id = body_id;
    v.hash = hash;
    v.ipfs_link = "https://gateway.pinata.cloud/ipfs/" + pinataHash;
    v.enckey = enckey;
  }
  res
    .set(env.customHeaders)
    .status(v.res ? 200 : 400)
    .json(v.res ? apiResponse(v, 1) : apiResponse(v, 41, true, v.msg));
};

exports.put = async function (req, res) {
  const args = {
    owner_id: req.body.owner_id,
    polla_id: req.body.polla_id,
    title: req.body.title,
    allow_approve: parseInt(req.body.allow_approve),
    allow_approve_per_version: parseInt(req.body.allow_approve_per_version),
    broadcast_update: parseInt(req.body.broadcast_update),
  };
  var v = await transaction("edtpolla", args);
  v.affected_id = req.body.polla_id;
  res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};

exports.delete = async function (req, res) {
  const args = {
    owner_id: req.body.owner_id,
    polla_id: req.body.polla_id,
  };
  var v = await transaction("rmpolla", args);
  res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};

exports.crawl = async function (req, res) {
  var policy = null;
  var policies = await table_page(
    mit.policies,
    true,
    1,
    req.body.policy_id,
    req.body.policy_id
  );
  if (policies.rows.length == 0) {
    res
      .set(env.customHeaders)
      .status(404)
      .send(apiResponse(null, 41, true, "Not found"));
  } else {
    policy = policies.rows[0];
    mysqlPlanetScale.query(
      "SELECT croule_urls FROM  `poldef`  WHERE policy_id = " + policy.id,
      function (err, result, fields) {
        console.log(err, result);
        if (err) throw err;
        policy.croule_urls = result[0];

        res.set(env.customHeaders).status(200).json(apiResponse(result, 1));
      }
    );
  }
};

exports.crawls = async function (req, res) {
  var policy = null;
  var policies = await table_page(
    mit.policies,
    true,
    1,
    req.body.policy_id,
    req.body.policy_id
  );
  if (policies.rows.length > 0) {
    policy = policies.rows[0];
  }

  const croule_urls = JSON.parse(req.body.croule_urls);

  mysqlPlanetScale.query(
    'UPDATE `poldef` SET croule_urls = "' +
      croule_urls +
      '" WHERE policy_id = ' +
      req.body.policy_id
  );

  res
    .set(env.customHeaders)
    .status(200)
    .json(apiResponse({ croule_urls: croule_urls }, 1));
};

exports.callbacks = async function (req, res) {
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

  const confirm_cb = req.body.confirm_cb;
  const notification_cb = req.body.notification_cb;

  if (confirm_cb) {
    try {
      const { statusCode } = await curly.get(confirm_cb, {
        NOBODY: true,
        FOLLOWLOCATION: true,
        SSL_VERIFYHOST: false,
        SSL_VERIFYPEER: false,
      });
      if (statusCode != 200) {
        res
          .set(env.customHeaders)
          .status(400)
          .json(
            apiResponse({}, 10, true, "confirm_cb http code " + statusCode)
          );
        return;
      }
      if (!confirm_cb.startsWith(domain.url)) {
        res
          .set(env.customHeaders)
          .status(400)
          .json(
            apiResponse(
              {},
              10,
              true,
              "confirm_cb does not belong to " + domain.url
            )
          );
        return;
      }
    } catch (e) {
      res
        .set(env.customHeaders)
        .status(400)
        .json(apiResponse({ confirm_cb: confirm_cb, e: e }, 10, true, e));
      return;
    }
  }

  if (notification_cb) {
    try {
      const { statusCode } = await curly.get(notification_cb, {
        NOBODY: true,
        FOLLOWLOCATION: true,
        SSL_VERIFYHOST: false,
        SSL_VERIFYPEER: false,
      });
      if (statusCode != 200) {
        res
          .set(env.customHeaders)
          .status(400)
          .json(
            apiResponse({}, 10, true, "notification_cb http code " + statusCode)
          );
        return;
      }
      if (!notification_cb.startsWith(domain.url)) {
        res
          .set(env.customHeaders)
          .status(400)
          .json(
            apiResponse(
              {},
              10,
              true,
              "notification_cb does not belong to " + domain.url
            )
          );
        return;
      }
    } catch (e) {
      res
        .set(env.customHeaders)
        .status(400)
        .json(apiResponse({ notification_cb: notification_cb }, 10, true, e));
      return;
    }
  }

  mysqlPlanetScale.query(
    'UPDATE `poldef` SET notification_cb = "' +
      notification_cb +
      '" , confirm_cb = "' +
      confirm_cb +
      '" WHERE policy_id = ' +
      req.body.policy_id
  );

  res
    .set(env.customHeaders)
    .status(200)
    .json(
      apiResponse(
        { confirm_cb: confirm_cb, notification_cb: notification_cb },
        1
      )
    );
};
