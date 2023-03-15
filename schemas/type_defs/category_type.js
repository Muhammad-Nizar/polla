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

const CategoryType = new GraphQLObjectType({
    name: "Category",
    description: 'This represents a Category, every shop has one or more categories, some of categories are default',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        shop_id: { type: GraphQLNonNull(GraphQLInt) },
        category_name: { type: GraphQLNonNull(GraphQLString) },
        hidden: { type: GraphQLBoolean },
        offer: { type: GraphQLBoolean },
        general: { type: GraphQLBoolean },
        created_at: { type: GraphQLNonNull(GraphQLString) },
        updated_at: { type: GraphQLInt },
        total_assets: { type: GraphQLInt },
        total_verified_assets: { type: GraphQLInt },
        total_income: { type: GraphQLInt },
        total_auctions: { type: GraphQLInt },
        total_ongoing_auctions: { type: GraphQLInt },
    }),
});
const CategoryTypeList = new GraphQLObjectType({
    name: "CategoryTypeList",
    fields: () => ({
        data: { type: GraphQLList(CategoryType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});
module.exports.CategoryTypeList = CategoryTypeList;
module.exports.CategoryType = CategoryType;