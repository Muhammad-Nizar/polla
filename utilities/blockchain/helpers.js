const { rpc, api } = require('./connect');

const contract = "qwpokn12345r";
const admin = "qwpokn12345r";
const adminPK = "EOS5fw9WndZnGUbe7eZWG7CPVnCZ13vN65g7pBVH5vVm4brmQJUhB";

async function _64StartEnd(s, e, ss, ee) {
    payer = "qwpokn12345r"
    try {
        const result = await api.transact({
            actions: [{
                account: contract,
                name: 'idxrng1',
                authorization: [{
                    actor: payer,
                    permission: 'active',
                },],
                data: {
                    l: s,
                    r: e,
                    ll: ss,
                    rr: ee
                },
            },],
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        const obj = result; //JSON.parse(result); 
        return (obj['processed']['action_traces'][0]['console']);
    } catch (e) {
        console.log('\nCaught exception: ' + e);
        return 0
    }
}
async function _9664StartEnd(s, m, e, ss, mm, ee) {
    payer = "qwpokn12345r"
    try {
        const result = await api.transact({
            actions: [{
                account: contract,
                name: 'idxrng2',
                authorization: [{
                    actor: payer,
                    permission: 'active',
                },],
                data: {
                    l: s,
                    m: m,
                    r: e,
                    ll: ss,
                    mm: mm,
                    rr: ee
                },
            },],
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        const obj = result; //JSON.parse(result); 
        return (obj['processed']['action_traces'][0]['console']);
    } catch (e) {
        console.log('\nCaught exception: ' + e);
        return 0
    }
}
module.exports.idx_range64 = _64StartEnd;
module.exports.idx_range9664 = _9664StartEnd;