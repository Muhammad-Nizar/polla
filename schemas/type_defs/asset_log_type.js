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
const AssetLogType = new GraphQLObjectType({
    name: "AssetLog",
    description: 'This represents a AssetLog, every transaction on an asset is logged here',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        asset_id: { type: GraphQLNonNull(GraphQLInt) },
        sku_id: { type: GraphQLNonNull(GraphQLInt) },
        created_at: { type: GraphQLNonNull(GraphQLInt) },
        account: { type: GraphQLNonNull(GraphQLInt) }, 
        memo: { type: GraphQLString },
        trx_reason: { type: GraphQLNonNull(GraphQLInt) },
    }),
});

const AssetLogTypeList = new GraphQLObjectType({
    name: "DomainTypeList",
    fields: () => ({
        data: { type: GraphQLList(AssetLogType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});
module.exports.AssetLogTypeList = AssetLogTypeList;
module.exports.AssetLogType = AssetLogType;