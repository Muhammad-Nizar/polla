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

const BidderType = new GraphQLObjectType({
    name: "Bidder",
    description: 'This represents a Bidder, related to auctions',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        auction_id: { type: GraphQLNonNull(GraphQLInt) },
        asset_id: { type: GraphQLNonNull(GraphQLInt) },
        price: { type: GraphQLNonNull(graphql.GraphQLFloat) },
        created_at: { type: GraphQLNonNull(GraphQLInt) },
        bidder: { type: GraphQLNonNull(GraphQLString) },
        trx: { type: GraphQLNonNull(GraphQLString) },
    }),
});
const BidderTypeList = new GraphQLObjectType({
    name: "BidderTypeList",
    fields: () => ({
        data: { type: GraphQLList(BidderType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});
module.exports.BidderTypeList = BidderTypeList;
module.exports.BidderType = BidderType;