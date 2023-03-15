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

const { ShopTypeShort } = require("../type_defs/shop_type_short");
const TemplateType = new GraphQLObjectType({
    name: "Template",
    description: 'This represents a Template, All shop`s SKUs belongs to a template',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        shop_id: { type: GraphQLNonNull(GraphQLInt) },
        template_name: { type: GraphQLNonNull(GraphQLString) },
        total_skus: { type: GraphQLID },
        created_at: { type: GraphQLNonNull(GraphQLString) },
        updated_at: { type: GraphQLInt },
        total_verified_skus: { type: GraphQLInt },
        total_income: { type: GraphQLInt },
        total_auctions: { type: GraphQLInt },
        total_ongoing_auctions: { type: GraphQLInt },

        shop: { type: ShopTypeShort },
    }),
});
const TemplateTypeList = new GraphQLObjectType({
    name: "TemplateTypeList",
    fields: () => ({
        data: { type: GraphQLList(TemplateType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});
module.exports.TemplateTypeList = TemplateTypeList;
module.exports.TemplateType = TemplateType;