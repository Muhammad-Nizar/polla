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

const CollectionType = new GraphQLObjectType({
    name: "Collection",
    description: 'This represents a collection where one or more SKUs belogn to, Managed by the admin',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        collection_name: { type: GraphQLNonNull(GraphQLString) },
        total_skus: { type: GraphQLInt },
        total_verified_skus: { type: GraphQLInt },
        total_minted_assets: { type: GraphQLInt },
        total_owned_assets: { type: GraphQLInt },
        total_purchased_assets: { type: GraphQLInt },
        total_income: { type: GraphQLInt },
        total_auctions: { type: GraphQLInt },
        total_ongoing_auctions: { type: GraphQLInt },
        max_bid_price: { type: GraphQLInt },
        min_bid_price: { type: GraphQLInt },
        max_mint_price: { type: GraphQLInt },
        min_mint_price: { type: GraphQLInt },
    }),
});
const CollectionTypeList = new GraphQLObjectType({
    name: "CollectionTypeList",
    fields: () => ({
        data: { type: GraphQLList(CollectionType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});

module.exports.CollectionTypeList = CollectionTypeList;
module.exports.CollectionType = CollectionType;