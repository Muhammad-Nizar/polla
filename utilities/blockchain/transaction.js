const { rpc, api } = require('./connect');
const { table_page } = require("./listing_tables");

const { mit } = require("../../config/const");

const contract = "qwpokn12345r";

async function _transaction(action, _data) {
    var actor = "qwpokn12345r";
    var permission = "active";
    payer = "qwpokn12345r";
    var res = {
        res: false,
        trx: null,
        msg: null,
        affected_id: null
    };
    try {
        console.log("action", action)
        const result = await api.transact({
            actions: [{
                account: contract,
                name: action,
                authorization: [{
                    actor: actor,
                    permission: permission,
                }, ],
                data: _data,
            }, ],
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        const obj = result; //JSON.parse(result); 
        if (typeof obj.code !== 'undefined' && obj.code == 500) {
            res.msg = obj.error.details[0].message;
        }
        // console.log(obj.processed.action_traces[0])
        // console.log(obj.transaction_id, obj.processed.block_num)

        //const r1 = await rpc.history_get_transaction(obj.transaction_id, obj.processed.block_num) 
        if (typeof obj.transaction_id !== 'undefined') {
            res.trx = obj.transaction_id;
            res.res = true;
            res.msg = "Done successfully " + action;
            res.affected_id = obj.processed.action_traces[0].console;

            //Start workaround
            // if (action == "addowner") {
            //     r = await table_page(mit.owners, true, 1);
            //     res.affected_id = r.rows[0].id;
            // } else if (action == "adddomain") {
            //     r = await table_page(mit.domains, true, 1);
            //     res.affected_id = r.rows[0].id;
            // } else if (action == "addpolla") {
            //     r = await table_page(mit.policies, true, 1);
            //     res.affected_id = r.rows[0].id;
            // } else if (action == "addpollatxt") {
            //     r = await table_page(mit.bodies, true, 1);
            //     res.affected_id = r.rows[0].id;
            // } else if (action == "edtpollatxt") {
            //     r = await table_page(mit.bodies, true, 1);
            //     res.affected_id = r.rows[0].id;
            // } else if (action == "addapprove") {
            //     r = await table_page(mit.approvals, true, 1);
            //     res.affected_id = r.rows[0].id;
            // } else if (action == "addplan") {
            //     r = await table_page(mit.plans, true, 1);
            //     res.affected_id = r.rows[0].id;
            // }
            //End workaround
        }
    } catch (e) {
        //console.log('\nCaught exception: ' + e);
        console.error(e);
        res.msg = e.json.error.details[0].message;
        //console.log(JSON.stringify(e.json, null, 2));
        //res.msg = e.json.error.details[0].message;
    } finally {
        return res
    }
}
module.exports.transaction = _transaction;