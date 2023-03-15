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
const { AOHType } = require("./asset_owners_history_type")
const { ShopType } = require("../type_defs/shop_type");
const { CollectionType } = require("../type_defs/collection_type");
const { TemplateType } = require("../type_defs/template_type");
const { CategoryType } = require("../type_defs/category_type");
const { SkuType } = require("../type_defs/sku_type");

const tst = new GraphQLObjectType({
    name: "tst",
    description: 'Asset Owners History',
    fields: () => ({
        key: { type: GraphQLString },
        value: { type: GraphQLString },
    }),
});

const AssetType = new GraphQLObjectType({
    name: "Asset",
    description: 'This represents a Minted Asset, every asset is owned by a blockchain account, and belogns to a category, It is minted from an SKU under a specific template',
    fields: () => ({
        id: { type: GraphQLInt }, //GraphQLNonNull
        sku_id: { type: GraphQLNonNull(GraphQLInt) },
        shop_id: { type: GraphQLNonNull(GraphQLInt) },
        category_id: { type: GraphQLNonNull(GraphQLInt) },
        template_id: { type: GraphQLNonNull(GraphQLInt) },
        collection_id: { type: GraphQLNonNull(GraphQLInt) },
        is_burned: { type: GraphQLBoolean },
        burned_at: { type: GraphQLInt },
        verified: { type: GraphQLBoolean },
        lock: { type: GraphQLInt },
        created_at: { type: GraphQLNonNull(GraphQLInt) },
        updated_at: { type: GraphQLInt },
        last_sale_at: { type: GraphQLInt },
        last_mint_at: { type: GraphQLInt },
        last_offer_at: { type: GraphQLInt },
        last_auction_at: { type: GraphQLInt },
        price_history: { type: GraphQLList(GraphQLNonNull(tst)) },
        status_history: { type: GraphQLList(GraphQLNonNull(tst)) },
        owners_history: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AOHType))) },
        mint_memo: { type: GraphQLString },
        price: { type: graphql.GraphQLFloat },
        owner: { type: GraphQLString },
        own_method: { type: GraphQLInt },
        owndate: { type: GraphQLInt },
        auctions_count: { type: GraphQLNonNull(GraphQLInt) },
        offers_count: { type: GraphQLInt },

        collection: { type: CollectionType },
        category: { type: CategoryType },
        sku: { type: SkuType },
        template: { type: TemplateType },
        shop: { type: ShopType },

    }),
});
const AssetTypeList = new GraphQLObjectType({
    name: "AssetTypeList",
    fields: () => ({
        data: { type: GraphQLList(AssetType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLString },
    }),
});
module.exports.AssetTypeList = AssetTypeList;
module.exports.AssetType = AssetType;
