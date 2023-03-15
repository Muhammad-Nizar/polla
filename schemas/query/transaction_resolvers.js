const graphql = require("graphql");
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID,
    GraphQLEnumType
} = graphql;
const { transaction, createAccount, addRam } = require('../../utilities/blockchain/transaction');
var { TrxResType } = require("../type_defs/trans_response_type");
var { findByAuthToken, idProof } = require("../../models/user");

var TrxResType_401 = {
    res: false,
    msg: "Not Authenticated"
};
var TrxResType_403 = {
    res: false,
    msg: "Not Authorized"
};

function resp(v) {
    TrxResType.res = v.res;
    TrxResType.trx = v.trx;
    TrxResType.msg = v.msg;
    TrxResType.affected_id = v.affected_id && parseInt(v.affected_id) ? v.affected_id : null;
    return TrxResType;
}

async function addshop_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("addshop", args, user);
    return resp(v);
}

async function edtshop_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    const accountProof = await idProof(context.proof);

    if (!accountProof || accountProof.account_name != user.auth.split("@")[0]) {
        return TrxResType_403;
    }
    var v = await transaction("edtshop", args, user);
    return resp(v);
}

async function vershop_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("vershop", args, user);
    return resp(v);
}

async function addcat_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("addcat", args, user);
    return resp(v);
}

async function edtcat_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("edtcat", args, user);
    return resp(v);
}

async function rmcat_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("rmcat", args, user);
    return resp(v);
}

async function addtemp_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("addtemp", args, user);
    return resp(v);
}

async function edttemp_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("edttemp", args, user);
    return resp(v);
}

async function rmtemp_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("rmtemp", args, user);
    return resp(v);
}

async function addsku_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    const accountProof = await idProof(context.proof);
    if (!accountProof || accountProof.account_name != user.auth.split("@")[0]) {
        return TrxResType_403;
    }
    var v = await transaction("addsku", args, user);
    return resp(v);
}

async function edtskutemp_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("edtskutemp", args, user);
    return resp(v);
}

async function rmsku_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("rmsku", args, user);
    return resp(v);
}

async function mintt_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    const accountProof = await idProof(context.proof);
    if (!accountProof || accountProof.account_name != user.auth.split("@")[0]) {
        return TrxResType_403;
    }
    var v = await transaction("mintt", args, user);
    return resp(v);
}

async function edtasset_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("edtasset", args, user);
    return resp(v);
}

async function buyasset_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    const accountProof = await idProof(context.proof);
    if (!accountProof || accountProof.account_name != user.auth.split("@")[0]) {
        return TrxResType_403;
    }
    var v = await transaction("buyasset", args, user);
    return resp(v);
}

async function transasset_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    const accountProof = await idProof(context.proof);
    if (!accountProof || accountProof.account_name != user.auth.split("@")[0]) {
        return TrxResType_403;
    }
    var v = await transaction("transasset", args, user);
    return resp(v);
}

async function burnasset_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    const accountProof = await idProof(context.proof);
    if (!accountProof || accountProof.account_name != user.auth.split("@")[0]) {
        return TrxResType_403;
    }
    var v = await transaction("burnasset", args, user);
    return resp(v);
}

async function handoff_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    const accountProof = await idProof(context.proof);
    if (!accountProof || accountProof.account_name != user.auth.split("@")[0]) {
        return TrxResType_403;
    }
    var v = await transaction("handoff", args, user);
    return resp(v);
}

async function addoff_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    const accountProof = await idProof(context.proof);
    if (!accountProof || accountProof.account_name != user.auth.split("@")[0]) {
        return TrxResType_403;
    }
    var v = await transaction("addoff", args, user);
    return resp(v);
}

async function closeauc_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    var v = await transaction("closeauc", args, user);
    return resp(v);
}

async function addbid_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    const accountProof = await idProof(context.proof);
    if (!accountProof || accountProof.account_name != user.auth.split("@")[0]) {
        return TrxResType_403;
    }
    var v = await transaction("addbid", args, user);
    return resp(v);
}

async function addauc_resolver(parent, args, context) {
    const user = await findByAuthToken(context.token);
    if (!user) {
        return TrxResType_401;
    }
    const accountProof = await idProof(context.proof);
    if (!accountProof || accountProof.account_name != user.auth.split("@")[0]) {
        return TrxResType_403;
    }
    var v = await transaction("addauc", args, user);
    return resp(v);
}

module.exports.handoffResolver = handoff_resolver;
module.exports.addoffResolver = addoff_resolver;
module.exports.closeaucResolver = closeauc_resolver;
module.exports.addbidResolver = addbid_resolver;
module.exports.addaucResolver = addauc_resolver;
module.exports.burnassetResolver = burnasset_resolver;
module.exports.transassetResolver = transasset_resolver;
module.exports.buyassetResolver = buyasset_resolver;
module.exports.edtassetResolver = edtasset_resolver;
module.exports.minttResolver = mintt_resolver;
module.exports.addskuResolver = addsku_resolver;
module.exports.edtskutempResolver = edtskutemp_resolver;
module.exports.rmskuResolver = rmsku_resolver;
module.exports.addtempResolver = addtemp_resolver;
module.exports.edttempResolver = edttemp_resolver;
module.exports.rmtempResolver = rmtemp_resolver;
module.exports.edtcatResolver = edtcat_resolver;
module.exports.rmcatResolver = rmcat_resolver;
module.exports.addcatResolver = addcat_resolver;
module.exports.vershopResolver = vershop_resolver;
module.exports.addshopResolver = addshop_resolver;
module.exports.edtshopResolver = edtshop_resolver;
module.exports.createAccountResolver = createAccount;
module.exports.addRamResolver = addRam;