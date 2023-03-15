const graphql = require("graphql");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean, GraphQLID,
} = graphql;

const TrxResType = new GraphQLObjectType({
    name: "TrxResType",
    description: 'This represents a transaction response when calling smart contract action',
    fields: () => ({
        res: { type: GraphQLNonNull(GraphQLBoolean) },
        msg: { type: GraphQLString },
        trx: { type: GraphQLString },
        affected_id: { type: GraphQLInt },
        more: { type:  GraphQLString}
    }),
});
module.exports.TrxResType = TrxResType;