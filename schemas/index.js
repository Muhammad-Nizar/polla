const graphql = require("graphql");
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
} = graphql;

const RootQuery = require("./query");
const Mutation = require("./mutation");


module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });