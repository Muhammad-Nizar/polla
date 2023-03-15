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

const DomainType = new GraphQLObjectType({
    name: "Domain",
    description: 'This represents a domain where one or more shops belong to, Managed by admin ',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        domain_name: { type: GraphQLNonNull(GraphQLString) },
        total_shops: { type: GraphQLInt },
        total_verified_shops: { type: GraphQLInt },
        total_skus: { type: GraphQLInt },
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

const DomainTypeList = new GraphQLObjectType({
    name: "DomainTypeList",
    fields: () => ({
        data: { type: GraphQLList(DomainType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});

module.exports.DomainType = DomainType;
module.exports.DomainTypeList = DomainTypeList;