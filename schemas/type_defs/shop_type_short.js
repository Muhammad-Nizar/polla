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
const ShopTypeShort = new GraphQLObjectType({
    name: "ShopShort",
    description: 'This represents a Shop, owned by valid blockchain account',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        domain_id: { type: GraphQLNonNull(GraphQLInt) },
        shop_name: { type: GraphQLNonNull(GraphQLString) },
        owner: { type: GraphQLNonNull(GraphQLString) },
        total_skus: { type: GraphQLID },
        description: { type: GraphQLString },
        logo: { type: GraphQLString },
        urls: { type: GraphQLList(GraphQLString) },
        created_at: { type: GraphQLNonNull(GraphQLString) },
        updated_at: { type: GraphQLInt },
        verified: { type: graphql.GraphQLBoolean },
        verified_at: { type: GraphQLInt },
        verifier: { type: GraphQLString },
        hidden_cat_id: { type: GraphQLNonNull(GraphQLInt) },
        offer_cat_id: { type: GraphQLNonNull(GraphQLInt) },
        general_cat_id: { type: GraphQLNonNull(GraphQLInt) },
        default_temp_id: { type: GraphQLNonNull(GraphQLInt) },
        max_ongoing_offers: { type: GraphQLInt },
        max_ongoing_auctions: { type: GraphQLInt },
        max_categories: { type: GraphQLInt },
        total_maxTemplates: { type: GraphQLInt },
        total_templates: { type: GraphQLInt },
        total_verified_skus: { type: GraphQLInt },
        total_minted_assets: { type: GraphQLInt },
        total_owned_assets: { type: GraphQLInt },
        total_purchased_assets: { type: GraphQLInt },
        total_income: { type: GraphQLInt },
        views_count: { type: GraphQLInt },
        total_auctions: { type: GraphQLInt },
        total_ongoing_auctions: { type: GraphQLInt },
        total_offers: { type: GraphQLInt },
        total_ongoing_offers: { type: GraphQLInt },
        max_bid_price: { type: GraphQLInt },
        max_offer_price: { type: GraphQLInt },
        max_mint_price: { type: GraphQLInt },
        
    }),
});
const ShopTypeShortList = new GraphQLObjectType({
    name: "ShopTypeList",
    fields: () => ({
        data: { type: GraphQLList(ShopType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});
module.exports.ShopTypeShortList = ShopTypeShortList;
module.exports.ShopTypeShort = ShopTypeShort;