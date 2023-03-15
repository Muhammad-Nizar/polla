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
const InfoType = new GraphQLObjectType({
    name: "Info",
    description: 'This represents general info about the store',
    fields: () => ({
        total_shops: { type: GraphQLID },
        total_verified_shops: { type: GraphQLID },
        total_skus: { type: GraphQLID },
        total_verified_skus: { type: GraphQLID },
        total_assets: { type: GraphQLID },
        total_transfer: { type: GraphQLID },
        total_purchase: { type: GraphQLID },
        total_income: { type: GraphQLID },
        burned_assets: { type: GraphQLID },
        total_offers: { type: GraphQLID },
        total_active_offers: { type: GraphQLID },
        total_auctions: { type: GraphQLID },
        total_active_auctions: { type: GraphQLID },
    }),
});

module.exports = InfoType;
