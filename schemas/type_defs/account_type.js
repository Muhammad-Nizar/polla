const graphql = require("graphql");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID,
} = graphql;

const AccountType = new GraphQLObjectType({
    name: "AccountType",
    description: 'This represents a AccountType where one or more SKUs belogn to, Managed by the admin',
    fields: () => ({
        account_name: { type: GraphQLString },
        created: { type: GraphQLString },
        core_liquid_balance: { type: GraphQLString },
        total_resources_net_weight: { type: GraphQLString },
        total_resources_cpu_weight: { type: GraphQLString },
        total_resources_ram_bytes: { type: GraphQLString },
        total_resources_owner: { type: GraphQLString },
        ram_quota: { type: GraphQLString },
        net_weight: { type: GraphQLString },
        cpu_weight: { type: GraphQLString }
    }),
});
module.exports = AccountType;