const graphql = require("graphql");
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID,
    GraphQLEnumType,
    GraphQLNonNull
} = graphql;

const { TrxResType } = require("./type_defs/trans_response_type");
const { handoffResolver, addoffResolver, closeaucResolver, addbidResolver, addaucResolver, buyassetResolver, transassetResolver, burnassetResolver, edtassetResolver, minttResolver, addskuResolver, edtskutempResolver, rmskuResolver, addtempResolver, edttempResolver, rmtempResolver, rmcatResolver, edtcatResolver, addcatResolver, vershopResolver, addshopResolver, edtshopResolver, addRamResolver, createAccountResolver } = require("./query/transaction_resolvers");
const { shopResolver } = require("../schemas/query/listing_resolvers");

var { login } = require("../models/user");
const AuthType = require("./type_defs/auth_type");


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAccount: {
            type: TrxResType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, context) {
                return await createAccountResolver(args.name);
            },
        },
        addRam: {
            type: TrxResType,
            args: {
                to: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, context) {
                return await addRamResolver(args.to);
            },
        },
        login: {
            type: AuthType,
            args: {
                auth: { type: GraphQLNonNull(GraphQLString) },
                proof: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, context) {
                return await login(args.auth, args.proof);
            },
        },
        addshop: {
            type: TrxResType,
            args: {
                domain_id: { type: GraphQLNonNull(GraphQLInt) },
                shop_name: { type: GraphQLNonNull(GraphQLString) },
                owner: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString, defaultValue: null },
                logo: { type: GraphQLString, defaultValue: null },
                urls: { type: GraphQLList(GraphQLNonNull(GraphQLString)), defaultValue: [] },
            },
            async resolve(parent, args, context) {
                var res = await addshopResolver(parent, {
                    domain_id: args.domain_id,
                    shop_name: args.shop_name,
                    owner: "args.owner",
                    description: args.description,
                    logo: args.logo,
                    urls: args.urls,
                }, context);
                if (res.res) {
                    var shop = await shopResolver(parent, { id: res.affected_id }, true);
                    res.more = JSON.stringify(shop.data[0], null, 2)
                }
                return res;
            },
        },
        edtshop: {
            type: TrxResType,
            args: {
                shop_id: { type: GraphQLNonNull(GraphQLInt) },
                description: { type: GraphQLString, defaultValue: null },
                logo: { type: GraphQLString, defaultValue: null },
                urls: { type: GraphQLList(GraphQLNonNull(GraphQLString)), defaultValue: [] },
            },
            async resolve(parent, args, context) {
                var res = await edtshopResolver(parent, {
                    shop_id: args.shop_id,
                    description: args.description,
                    logo: args.logo,
                    urls: args.urls,
                }, context);
                return res;
            },
        },
        vershop: {
            type: TrxResType,
            args: {
                shop_id: { type: GraphQLNonNull(GraphQLInt) },
                verifier: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, context) {
                var res = await vershopResolver(parent, {
                    shop_id: args.shop_id,
                    verifier: args.verifier,
                }, context);
                return res;
            },
        },
        rmshop: {
            type: TrxResType,
            args: {
                firstName: { type: GraphQLString },
            },
            resolve(parent, args, context) {
                //TODO 
                return args;
            },
        },
        addcat: {
            type: TrxResType,
            args: {
                shop_id: { type: GraphQLNonNull(GraphQLInt) },
                category_name: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, context) {
                var res = await addcatResolver(parent, {
                    shop_id: args.shop_id,
                    category_name: args.category_name,
                }, context);
                return res;
            },
        },
        edtcat: {
            type: TrxResType,
            args: {
                category_id: { type: GraphQLNonNull(GraphQLInt) },
                category_name: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, context) {
                var res = await edtcatResolver(parent, {

                    category_id: args.category_id,
                    category_name: args.category_name,
                }, context);
                return res;
            },
        },
        rmcat: {
            type: TrxResType,
            args: {
                category_id: { type: GraphQLNonNull(GraphQLInt) },
            },
            async resolve(parent, args, context) {
                var res = await rmcatResolver(parent, {
                    category_id: args.category_id,
                }, context);
                return res;
            },
        },
        addtemp: {
            type: TrxResType,
            args: {
                shop_id: { type: GraphQLNonNull(GraphQLInt) },
                template_name: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, context) {
                var res = await addtempResolver(parent, {
                    shop_id: args.shop_id,
                    template_name: args.template_name,
                }, context);
                return res;
            },
        },
        edttemp: {
            type: TrxResType,
            args: {
                template_id: { type: GraphQLNonNull(GraphQLInt) },
                template_name: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, context) {
                var res = await edttempResolver(parent, {
                    template_id: args.template_id,
                    template_name: args.template_name,
                }, context);
                return res;
            },
        },
        rmtemp: {
            type: TrxResType,
            args: {
                template_id: { type: GraphQLNonNull(GraphQLInt) },
            },
            async resolve(parent, args, context) {
                var res = await rmtempResolver(parent, {
                    template_id: args.template_id,
                }, context);
                return res;
            },
        },
        addsku: {
            type: TrxResType,
            args: {
                shop_id: { type: GraphQLNonNull(GraphQLInt) },
                template_id: { type: GraphQLNonNull(GraphQLInt) },
                collection_id: { type: GraphQLNonNull(GraphQLInt) },
                sku_name: { type: GraphQLNonNull(GraphQLString) },
                cover: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString, defaultValue: null },
                media_list: { type: GraphQLList(GraphQLNonNull(GraphQLString)), defaultValue: [] },
                properities_k: { type: GraphQLList(GraphQLNonNull(GraphQLString)), defaultValue: [] },
                properities_v: { type: GraphQLList(GraphQLNonNull(GraphQLString)), defaultValue: [] },
                burnable: { type: GraphQLNonNull(GraphQLBoolean), defaultValue: false },
                max_supply: { type: GraphQLNonNull(GraphQLInt), defaultValue: 1 },
            },
            async resolve(parent, args, context) {
                var properities = [];
                args.properities_k.forEach(function (item, index) {
                    properities.push({
                        key: args.properities_k[index],
                        value: args.properities_v[index],
                    });
                });
                var res = await addskuResolver(parent, {
                    shop_id: args.shop_id,
                    template_id: args.template_id,
                    collection_id: args.collection_id,
                    sku_name: args.sku_name,
                    description: args.description,
                    cover: args.cover,
                    media_list: args.media_list,
                    properities: properities,
                    burnable: args.burnable,
                    max_supply: args.max_supply,
                }, context);
                return res;
            },
        },
        edtskutemp: {
            type: TrxResType,
            args: {
                template_id: { type: GraphQLNonNull(GraphQLInt) },
                sku_id: { type: GraphQLNonNull(GraphQLInt) },
            },
            async resolve(parent, args, context) {
                var res = await edtskutempResolver(parent, {
                    template_id: args.template_id,
                    sku_id: args.sku_id,
                }, context);
                return res;
            },
        },
        rmsku: {
            type: TrxResType,
            args: {
                sku_id: { type: GraphQLNonNull(GraphQLInt) },
            },
            async resolve(parent, args, context) {
                var res = await rmskuResolver(parent, {
                    sku_id: args.sku_id,
                }, context);
                return res;
            },
        },
        rmskuadmin: {
            type: TrxResType,
            args: {
                firstName: { type: GraphQLString },
            },
            resolve(parent, args, context) {
                //TODO 
                return args;
            },
        },
        versku: {
            type: TrxResType,
            args: {
                firstName: { type: GraphQLString },
            },
            resolve(parent, args, context) {
                //TODO node + c++
                return args;
            },
        },
        mintt: {
            type: TrxResType,
            args: {
                sku_id: { type: GraphQLNonNull(GraphQLInt) },
                category_id: { type: GraphQLNonNull(GraphQLInt) },
                price: { type: GraphQLNonNull(GraphQLInt) },
                mint_memo: { type: GraphQLString, defaultValue: null },
            },
            async resolve(parent, args, context) {
                var res = await minttResolver(parent, {

                    sku_id: args.sku_id,
                    category_id: args.category_id,
                    price: args.price,
                    mint_memo: args.mint_memo,
                }, context);
                return res;
            },
        },
        edtasset: {
            type: TrxResType,
            args: {
                category_id: { type: GraphQLNonNull(GraphQLInt) },
                asset_id: { type: GraphQLNonNull(GraphQLInt) },
                price: { type: GraphQLNonNull(GraphQLInt) },
            },
            async resolve(parent, args, context) {
                var res = await edtassetResolver(parent, {
                    category_id: args.category_id,
                    asset_id: args.asset_id,
                    price: args.price,
                }, context);
                return res;
            },
        },
        burnasset: {
            type: TrxResType,
            args: {
                asset_id: { type: GraphQLNonNull(GraphQLInt) },
            },
            async resolve(parent, args, context) {
                var res = await burnassetResolver(parent, {
                    asset_id: args.asset_id,
                }, context);
                return res;
            },
        },
        transasset: {
            type: TrxResType,
            args: {
                asset_id: { type: GraphQLNonNull(GraphQLInt) },
                to: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, context) {
                var res = await transassetResolver(parent, {
                    asset_id: args.asset_id,
                    to: args.to,
                }, context);
                return res;
            },
        },
        buyasset: {
            type: TrxResType,
            args: {
                asset_id: { type: GraphQLNonNull(GraphQLInt) },
                new_owner: { type: GraphQLNonNull(GraphQLString) },
                price: { type: GraphQLNonNull(GraphQLFloat) },
            },
            async resolve(parent, args, context) {
                var res = await buyassetResolver(parent, {
                    asset_id: args.asset_id,
                    new_owner: args.new_owner,
                    price: args.price,
                }, context);
                return res;
            },
        },
        addauc: {
            type: TrxResType,
            args: {
                asset_id: { type: GraphQLNonNull(GraphQLInt) },
                min_price: { type: GraphQLNonNull(GraphQLFloat) },
            },
            async resolve(parent, args, context) {
                var res = await addaucResolver(parent, {
                    asset_id: args.asset_id,
                    min_price: args.min_price,
                }, context);
                return res;
            },
        },
        addbid: {
            type: TrxResType,
            args: {
                auction_id: { type: GraphQLNonNull(GraphQLInt) },
                bidder: { type: GraphQLNonNull(GraphQLString) },
                bid_price: { type: GraphQLNonNull(GraphQLFloat) },
            },
            async resolve(parent, args, context) {
                var res = await addbidResolver(parent, {
                    auction_id: args.auction_id,
                    bidder: args.bidder,
                    bid_price: args.bid_price,
                }, context);
                return res;
            },
        },
        closeauc: {
            type: TrxResType,
            args: {
                auction_id: { type: GraphQLNonNull(GraphQLInt) },
            },
            async resolve(parent, args, context) {
                var res = await closeaucResolver(parent, {
                    auction_id: args.auction_id,
                }, context);
                return res;
            },
        },
        addoff: {
            type: TrxResType,
            args: {
                asset_id: { type: GraphQLNonNull(GraphQLInt) },
                sender: { type: GraphQLNonNull(GraphQLString) },
                offer_price: { type: GraphQLNonNull(GraphQLFloat) },
                sender_memo: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, context) {
                var res = await addoffResolver(parent, {
                    asset_id: args.asset_id,
                    sender: args.sender,
                    offer_price: args.offer_price,
                    price: args.offer_price, //TODO
                    sender_memo: args.sender_memo,
                }, context);
                return res;
            },
        },
        handoff: {
            type: TrxResType,
            args: {
                offer_id: { type: GraphQLNonNull(GraphQLInt) },
                by: { type: GraphQLNonNull(GraphQLString) },
                status: { type: GraphQLNonNull(GraphQLInt) },
                memo: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, context) {
                var res = await handoffResolver(parent, {
                    offer_id: args.offer_id,
                    by: args.by,
                    status: args.status,
                    memo: args.memo,
                }, context);
                return res;
            },
        },
        adddomain: {
            type: TrxResType,
            args: {
                firstName: { type: GraphQLString },
            },
            resolve(parent, args, context) {
                //TODO 
                return args;
            },
        },
        addcollec: {
            type: TrxResType,
            args: {
                firstName: { type: GraphQLString },
            },
            resolve(parent, args, context) {
                //TODO 
                return args;
            },
        },
    },
});

module.exports = Mutation;