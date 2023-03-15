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
const IdxRange = new GraphQLObjectType({
    name: "IdxRange",
    description: 'This represents id (big int)',
    fields: () => ({
        idxStart: { type: GraphQLID },
        idxEnd: { type: GraphQLID },
    }),
});

module.exports = IdxRange;