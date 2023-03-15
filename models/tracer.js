var moment = require('moment');
var { postgresConnection } = require('../utilities/database');

const tbl = "admin_tracer";

async function create(creator, action, action_data, more_details = null) {
    console.log(moment().format('yyyy-MM-DD H:mm:ss'))
    postgresConnection.none('INSERT INTO ' + tbl + '(created_at, creator, act, action_data, more_details) VALUES (\'' + moment().format('yyyy-MM-DD H:mm:ss') + '\', $1, $2, $3, $4)', [creator, action, action_data, more_details]);
}

module.exports.create = create;