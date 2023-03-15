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
const BalanceLockType = new GraphQLObjectType({
    name: "BalanceLock",
    description: 'This represents a BalanceLock, The balance is locked due to bidding an auction or creating an offer',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        op: { type: GraphQLNonNull(GraphQLInt) },
        opid: { type: GraphQLNonNull(GraphQLInt) },
        created_at: { type: GraphQLNonNull(GraphQLInt) },
        account: { type: GraphQLNonNull(GraphQLString) },
        memo: { type: GraphQLString },
        balance: { type: GraphQLNonNull(graphql.GraphQLFloat) },
    }),
});
const BalanceLockTypeList = new GraphQLObjectType({
    name: "BalanceLockTypeList",
    fields: () => ({
        data: { type: GraphQLList(BalanceLockType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});
module.exports.BalanceLockTypeList = BalanceLockTypeList;
module.exports.BalanceLockType = BalanceLockType;