const apiResponse = require("../utilities/response");
const { table_page } = require("../utilities/blockchain/listing_tables");
const { transaction } = require("../utilities/blockchain/transaction");
const { mit } = require("../config/const");
const env = require("../config/env");
const { encrypt, decrypt, sendEmail } = require("../utilities/helpers");
const { curly } = require("node-libcurl");
var { mysqlPlanetScale } = require("../utilities/database");
const limit = 10;

exports.get_list = async function (req, res) {
  var v = await table_page(
    mit.approvals,
    req.query.sort != "asc",
    limit,
    req.query.sort == "asc" && req.query.start ? req.query.start : 0,
    req.query.sort != "asc" && req.query.start ? req.query.start : null
  );
  res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};

exports.get_details = async function (req, res) {
  var v = await table_page(mit.approvals, true, 1, req.query.id, req.query.id);
  res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
};

exports.test = async function (req, res) {
  const crypto = require("crypto");

  const key = req.body.key;
  const sys_user_id = req.body.sys_user_id;
  const polla_id = req.body.polla_id;
  const owner_id = req.body.owner_id;
  const body_id = req.body.body_id;
  const extra = null;
  try {
    extra = JSON.parse(req.body.extra);
  } catch (e) {
    //extra = null;
  }

  palyload = JSON.stringify({
    sys_user_id: sys_user_id,
    owner_id: owner_id,
    body_id: body_id,
    polla_id: polla_id,
    extra: extra,
  });

  const iv = crypto.randomBytes(16);
  const data = encrypt(palyload, key, iv);

  res
    .set(env.customHeaders)
    .status(200)
    .json(apiResponse({ iv: iv.toString("hex"), data: data }, 1));
};

async function notifyOwner(notification_cb, params, extra, policy, body, trx) {
  if (notification_cb) {
    const q =
      "sys_user_id=" +
      params.sys_user_id +
      "&body_id=" +
      params.body_id +
      "&policy_id=" +
      params.polla_id;
    const { statusCode } = await curly.get(notification_cb + "?" + q, {
      NOBODY: true,
      FOLLOWLOCATION: true,
      SSL_VERIFYHOST: false,
      SSL_VERIFYPEER: false,
    });
    if (statusCode != 200) {
      console.log(statusCode, notification_cb + "?" + q);
      mysqlPlanetScale.query(
        'INSERT INTO `notque` (owner_id, domain_id, policy_id, notification_cb) VALUES ("' +
          params.owner_id +
          '","' +
          policy.domain_id +
          '","' +
          policy.id +
          '","' +
          notification_cb +
          "?" +
          q +
          '")'
      );
    }
  }

  if (extra && extra.email) {
    mysqlPlanetScale.query(
      "SELECT * FROM  `poldef`  WHERE policy_id = " + polla_id,
      async function (err, result, fields) {
        console.log(err, result);
        if (err) throw err;
        //insert email + owner id + policy id
        // later:
        // CRUD + unsubscribe
      }
    );
    sendEmail(
      extra.email,
      extra.name,
      policy.title,
      body.version,
      policy.id,
      body.id,
      trx
    );
  }
}

async function notifyOwnerQueueProcess() {
  const stamp = Math.floor(Date.now() / 1000) - (24 * 3600);
  mysqlPlanetScale.query(
    "DELETE FROM `notque` WHERE created_at < ",
    async function (err, result, fields) {
      console.log(err, result);
      if (err) throw err;

      mysqlPlanetScale.query(
        "SELECT * FROM  `notque`",
        async function (err, result, fields) {
          console.log(err, result);
          if (err) throw err;
          for (var i = 0; i < result.length; i++) {
            const { statusCode } = await curly.get(
              result[i].notification_cb + "?" + q,
              {
                NOBODY: true,
                FOLLOWLOCATION: true,
                SSL_VERIFYHOST: false,
                SSL_VERIFYPEER: false,
              }
            );
            if (statusCode == 200) {
              mysqlPlanetScale.query(
                "DELETE FROM `notque` WHERE id = " + result[i].id
              );
            }
          }
        }
      );
    }
  );
}

exports.postenc = async function (req, res) {
  const palyload = req.body.payload;
  const polla_id = req.body.polla_id;
  const iv = req.body.iv;

  mysqlPlanetScale.query(
    "SELECT * FROM  `poldef`  WHERE policy_id = " + polla_id,
    async function (err, result, fields) {
      console.log(err, result);
      if (err) throw err;
      policy_record = result[0];

      if (policy_record) {
        try {
          const str = decrypt(palyload, policy_record.enckey, iv);
          const params = JSON.parse(str);
          console.log(params);
          const extra = null;
          try {
            extra = JSON.parse(params.extra);
          } catch (e) {
            //extra = null;
          }
          const args = {
            sys_user_id: params.sys_user_id,
            owner_id: params.owner_id,
            body_id: params.body_id,
          };
          var v = await transaction("addapprove", args);

          var policy = await table_page(
            mit.policies,
            true,
            1,
            params.polla_id,
            params.polla_id
          );
          var body = await table_page(
            mit.bodies,
            true,
            1,
            params.body_id,
            params.body_id
          );
          if (v.msg) {
            notifyOwner(
              policy_record.notification_cb,
              params,
              extra,
              policy,
              body,
              v.trx
            );
            res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
          } else {
            res
              .set(env.customHeaders)
              .status(200)
              .json(apiResponse(v, 10, true));
          }
        } catch (e) {
          console.log(e);
          res
            .set(env.customHeaders)
            .status(400)
            .json(apiResponse({}, 10, true, "Bad Decrypt"));
        }
      } else {
        res
          .set(env.customHeaders)
          .status(200)
          .json(apiResponse(v, 1, true, "Policy record not found"));
      }
    }
  );
};

exports.postpub = async function (req, res) {
  const sys_user_id = req.body.sys_user_id;
  const owner_id = req.body.owner_id;
  const polla_id = req.body.polla_id;
  const body_id = req.body.body_id;
  const extra = null;
  try {
    extra = JSON.parse(req.body.extra);
  } catch (e) {
    //extra = null;
  }

  var policy = await table_page(mit.policies, true, 1, polla_id, polla_id);
  if (policy) {
    const args = {
      sys_user_id: sys_user_id,
      owner_id: owner_id,
      body_id: body_id,
    };

    var body = await table_page(mit.bodies, true, 1, body_id, body_id);

    mysqlPlanetScale.query(
      "SELECT * FROM  `poldef`  WHERE policy_id = " + polla_id,
      async function (err, result, fields) {
        console.log(err, result);
        if (err) throw err;
        policy_record = result[0];

        if (policy_record.confirm_cb) {
          const qq =
            "sys_user_id=" +
            sys_user_id +
            "&body_id=" +
            body_id +
            "&policy_id=" +
            polla_id;
          const { statusCode } = await curly.get(
            policy_record.confirm_cb + "?" + qq,
            {
              NOBODY: true,
              FOLLOWLOCATION: true,
              SSL_VERIFYHOST: false,
              SSL_VERIFYPEER: false,
            }
          );
          if (statusCode == 200) {
            console.log(statusCode, policy_record.confirm_cb + "?" + qq);
            var v = await transaction("addapprove", args);
            notifyOwner(
              policy_record.notification_cb,
              {
                sys_user_id: sys_user_id,
                body_id: body_id,
                polla_id: polla_id,
              },
              extra,
              policy,
              body,
              v.trx
            );
            res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
          } else {
            res
              .set(env.customHeaders)
              .status(400)
              .json(apiResponse(v, 1, true, "Not confirmed"));
          }
        } else {
          var v = await transaction("addapprove", args);
          notifyOwner(
            policy_record.notification_cb,
            { sys_user_id: sys_user_id, body_id: body_id, polla_id: polla_id },
            extra,
            policy,
            body,
            v.trx
          );
          res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
        }
      }
    );
  } else {
    res.set(env.customHeaders).status(200).json(apiResponse(v, 1));
  }
};
