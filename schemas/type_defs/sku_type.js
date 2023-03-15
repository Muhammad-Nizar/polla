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

const { ShopType } = require("../type_defs/shop_type");
const { CollectionType } = require("../type_defs/collection_type");
const { TemplateType } = require("../type_defs/template_type");
const porp = new GraphQLObjectType({
    name: "porp",
    fields: () => ({
        key: { type: GraphQLNonNull(GraphQLString) },
        value: { type: GraphQLNonNull(GraphQLString) },
    }),
});

const SkuType = new GraphQLObjectType({
    name: "SKU",
    description: 'This represents a SKU, every Sku has one or more categories, some of categories are default',
    fields: () => ({
        id: { type: GraphQLInt }, //GraphQLNonNull
        fk: { type: GraphQLInt },
        shop_id: { type: GraphQLNonNull(GraphQLInt) },
        template_id: { type: GraphQLNonNull(GraphQLInt) },
        collection_id: { type: GraphQLNonNull(GraphQLInt) },
        sku_name: { type: GraphQLNonNull(GraphQLString) },
        cover: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        created_at: { type: GraphQLNonNull(GraphQLString) },
        updated_at: { type: GraphQLInt },
        last_sale_at: { type: GraphQLInt },
        last_mint_at: { type: GraphQLInt },
        last_offer_at: { type: GraphQLInt },
        last_auction_at: { type: GraphQLInt },
        verified_at: { type: GraphQLInt },
        verifier: { type: GraphQLInt },
        verified: { type: GraphQLBoolean },
        burnable: { type: GraphQLBoolean },
        media_list: { type: GraphQLList(GraphQLString) },
        properities: { type: GraphQLList(porp) },
        max_supply: { type: GraphQLInt },
        min_mint_price: { type: GraphQLInt },
        max_mint_price: { type: GraphQLInt },
        total_mint: { type: GraphQLInt },
        trade_volume: { type: GraphQLInt },
        total_unlocked_assets: { type: GraphQLInt },
        total_owners: { type: GraphQLInt },
        total_views: { type: GraphQLInt },
        total_trades: { type: GraphQLInt },
        total_ongoing_trades: { type: GraphQLInt },
        total_auctions: { type: GraphQLInt },
        total_ongoing_auctions: { type: GraphQLInt },
        total_burned: { type: GraphQLInt },

        shop: { type: ShopType },
        collection: { type: CollectionType },
        template: { type: TemplateType },
    }),
});
const SkuTypeList = new GraphQLObjectType({
    name: "SkuTypeList",
    fields: () => ({
        data: { type: GraphQLList(SkuType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});
module.exports.SkuTypeList = SkuTypeList;
module.exports.SkuType = SkuType;