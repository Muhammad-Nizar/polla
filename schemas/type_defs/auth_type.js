const graphql = require("graphql");
const { ShopTypeList } = require('./shop_type')

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

const AuthType = new GraphQLObjectType({
    name: "AuthType",
    description: 'This represents a AuthType where one or more SKUs belogn to, Managed by the admin',
    fields: () => ({
        token: { type: GraphQLString },
        accountVal: { type: GraphQLString },
        accountValP: { type: GraphQLString },
        shop: { type: ShopTypeList },
    }),
});
module.exports = AuthType;
