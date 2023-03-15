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
const { accountInfo } = require('../../utilities/blockchain/account');

const AccountType = require("../type_defs/account_type");


async function accountInfo_resolver(parent, args) {
    var v = await accountInfo(args.accName);
    AccountType.account_name = v.account_name;
    AccountType.created = v.created;
    AccountType.core_liquid_balance = v.core_liquid_balance;

    AccountType.total_resources_net_weight = v.total_resources.net_weight;
    AccountType.total_resources_cpu_weight = v.total_resources.cpu_weight;
    AccountType.total_resources_ram_bytes = v.total_resources.ram_bytes;
    AccountType.total_resources_owner = v.total_resources.owner;

    AccountType.ram_quota = v.ram_quota;
    AccountType.net_weight = v.net_weight;
    AccountType.cpu_weight = v.cpu_weight;
    return AccountType;
}
module.exports.accountInfoResolver = accountInfo_resolver;