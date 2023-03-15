const graphql = require("graphql");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = graphql;

const AOHType = new GraphQLObjectType({
    name: "AOH",
    description: 'Asset Owners History',
    fields: () => ({
        owner: { type: GraphQLString },
        at: { type: GraphQLString },
        price: { type: GraphQLString },
        reason: { type: GraphQLString },
        trx: { type: GraphQLString },
    }),
});
const AOHTypeList = new GraphQLObjectType({
    name: "AOHTypeList",
    fields: () => ({
        data: { type: GraphQLList(AOHType) },
        more: { type: GraphQLBoolean, GraphQLID, },
        next_key: { type: GraphQLID },
    }),
});
module.exports.AOHTypeList = AOHTypeList;
module.exports.AOHType = AOHType;