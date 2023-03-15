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
const { BidderType } = require("./bidder_type");
const { ShopType } = require("../type_defs/shop_type");
const { CollectionType } = require("../type_defs/collection_type");
const { TemplateType } = require("../type_defs/template_type");
const { CategoryType } = require("../type_defs/category_type");
const { SkuType } = require("../type_defs/sku_type");
const { AssetType } = require("../type_defs/asset_type");
const AuctionType = new GraphQLObjectType({
    name: "Auction",
    description: 'This represents a Auction',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        asset_id: { type: GraphQLNonNull(GraphQLInt) },
        created_at: { type: GraphQLNonNull(GraphQLInt) },
        ended_at: { type: GraphQLNonNull(GraphQLInt) },
        min_price: { type: GraphQLNonNull(GraphQLInt) },
        latest_bid_price: { type: GraphQLInt },
        latest_bid_at: { type: GraphQLInt },
        latest_bidder: { type: GraphQLString },
        creator: { type: GraphQLNonNull(GraphQLString) },
        handled: { type: GraphQLNonNull(GraphQLBoolean) },
        bidders_list: { type: GraphQLList(GraphQLNonNull(BidderType)) },

        asset: { type: AssetType },
        category: { type: CategoryType },
        sku: { type: SkuType },
        collection: { type: CollectionType },
        template: { type: TemplateType },
        shop: { type: ShopType },
    }),
});
const AuctionTypeList = new GraphQLObjectType({
    name: "AuctionTypeList",
    fields: () => ({
        data: { type: GraphQLList(AuctionType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});
module.exports.AuctionTypeList = AuctionTypeList;
module.exports.AuctionType = AuctionType;