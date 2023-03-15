const { rpc, api } = require('./connect');


async function _accountInfo(accName) {
    try {
        const accountInfo = await rpc.get_account(accName);
        return accountInfo;
    } catch (e) {
        console.log('\nCaught exception: ' + e);
        //console.log(JSON.stringify(e.json, null, 2));
        return e.json.error.details[0].message;
    }
}

module.exports.accountInfo = _accountInfo;