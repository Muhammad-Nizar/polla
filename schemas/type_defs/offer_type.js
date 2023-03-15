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
const { ShopType } = require("../type_defs/shop_type");
const { CollectionType } = require("../type_defs/collection_type");
const { TemplateType } = require("../type_defs/template_type");
const { CategoryType } = require("../type_defs/category_type");
const { SkuType } = require("../type_defs/sku_type");
const { AssetType } = require("../type_defs/asset_type");
const OfferType = new GraphQLObjectType({
    name: "Offer",
    description: 'This represents a Offer',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        asset_id: { type: GraphQLNonNull(GraphQLInt) },
        sender: { type: GraphQLNonNull(GraphQLString) },
        receiver: { type: GraphQLNonNull(GraphQLString) },
        sender_memo: { type: GraphQLString },
        receiver_memo: { type: GraphQLString },
        price: { type: GraphQLNonNull(graphql.GraphQLFloat) },
        status: { type: GraphQLNonNull(GraphQLInt) },
        created_at: { type: GraphQLNonNull(GraphQLInt) },

        asset: { type: AssetType },
        category: { type: CategoryType },
        sku: { type: SkuType },
        collection: { type: CollectionType },
        template: { type: TemplateType },
        shop: { type: ShopType },
    }),
});
const OfferTypeList = new GraphQLObjectType({
    name: "OfferTypeList",
    fields: () => ({
        data: { type: GraphQLList(OfferType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});
module.exports.OfferTypeList = OfferTypeList;
module.exports.OfferType = OfferType;