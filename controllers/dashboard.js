const apiResponse = require("../utilities/response");
const { table_page } = require("../utilities/blockchain/listing_tables");
const { transaction } = require("../utilities/blockchain/transaction");
const env = require("../config/env");
var { mysqlPlanetScale } = require("../utilities/database");
const { mit } = require("../config/const");

exports.owner = async function (req, res) {
  const owner_id = req.query.owner_id;
  var v = await table_page(mit.owners, true, 1, owner_id, owner_id);
  if (v.rows.length == 0) {
    res
      .set(env.customHeaders)
      .status(404)
      .send(apiResponse(null, 41, true, "Not found"));
  } else {
    const owner = v.rows[0];
    var data = {
      policies: owner.policies,
      domains: owner.domains,
    };
    mysqlPlanetScale.query(
      "SELECT COUNT(*) AS cnt FROM readpolog WHERE owner_id = " + owner_id,
      function (err, result, fields) {
        console.log(err, result);
        if (err) throw err;
        data.total_reads = result[0].cnt;

        mysqlPlanetScale.query(
          "SELECT COUNT(*) AS cnt FROM approvelog WHERE owner_id = " + owner_id,
          function (err, result, fields) {
            console.log(err, result);
            if (err) throw err;
            data.total_approves = result[0].cnt;

            res.set(env.customHeaders).status(200).json(apiResponse(data, 1));
          }
        );
      }
    );
  }
};

exports.domain = async function (req, res) {
  const domain_id = req.query.domain_id;
  var v = await table_page(mit.domains, true, 1, domain_id, domain_id);
  if (v.rows.length == 0) {
    res
      .set(env.customHeaders)
      .status(404)
      .send(apiResponse(null, 41, true, "Not found"));
  } else {
    const domain = v.rows[0];
    var data = {
      policies: domain.policies, 
    };
    mysqlPlanetScale.query(
      "SELECT COUNT(*) AS cnt FROM readpolog WHERE domain_id = " + domain_id,
      function (err, result, fields) {
        console.log(err, result);
        if (err) throw err;
        data.total_reads = result[0].cnt;

        mysqlPlanetScale.query(
          "SELECT COUNT(*) AS cnt FROM approvelog WHERE domain_id = " + domain_id,
          function (err, result, fields) {
            console.log(err, result);
            if (err) throw err;
            data.total_approves = result[0].cnt;

            res.set(env.customHeaders).status(200).json(apiResponse(data, 1));
          }
        );
      }
    );
  }
};

exports.policy = async function (req, res) {
  const policy_id = req.query.policy_id;
  var v = await table_page(mit.policies, true, 1, policy_id, policy_id);
  if (v.rows.length == 0) {
    res
      .set(env.customHeaders)
      .status(404)
      .send(apiResponse(null, 41, true, "Not found"));
  } else {
    const policy = v.rows[0];
    var data = {
      bodies_list: policy.bodies_list, 
    };
    mysqlPlanetScale.query(
      "SELECT COUNT(*) AS cnt FROM readpolog WHERE policy_id = " + policy_id,
      function (err, result, fields) {
        console.log(err, result);
        if (err) throw err;
        data.total_reads = result[0].cnt;

        mysqlPlanetScale.query(
          "SELECT COUNT(*) AS cnt FROM approvelog WHERE policy_id = " + policy_id,
          function (err, result, fields) {
            console.log(err, result);
            if (err) throw err;
            data.total_approves = result[0].cnt;

            res.set(env.customHeaders).status(200).json(apiResponse(data, 1));
          }
        );
      }
    );
  }
};

exports.all = async function (req, res) {
  var data = {};
  var v = await transaction("getinfo", {});
  console.log(v)
  if (v.res) {
    data = v.affected_id;
    mysqlPlanetScale.query(
      "SELECT COUNT(*) AS cnt FROM readpolog;",
      function (err, result, fields) {
        console.log(err, result);
        if (err) throw err;
        data.total_reads = result[0].cnt;

        mysqlPlanetScale.query(
          "SELECT COUNT(*) AS cnt FROM approvelog;",
          function (err, result, fields) {
            console.log(err, result);
            if (err) throw err;
            data.total_approves = result[0].cnt;

            res.set(env.customHeaders).status(200).json(apiResponse(data, 1));
          }
        );
      }
    );
  }
};
