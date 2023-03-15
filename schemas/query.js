const graphql = require("graphql");
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID,
    GraphQLEnumType
} = graphql;

const { AssetTypeList } = require("./type_defs/asset_type");
const { AuctionTypeList } = require("./type_defs/auction_type");
const { BidderTypeList } = require("./type_defs/bidder_type");
const { CategoryTypeList } = require("./type_defs/category_type");
const { CollectionTypeList } = require("./type_defs/collection_type");
const { DomainTypeList } = require("./type_defs/domain_type");
const { OfferTypeList } = require("./type_defs/offer_type");
const { ShopTypeList } = require("./type_defs/shop_type");
const { SkuTypeList } = require("./type_defs/sku_type");
const { TemplateTypeList } = require("./type_defs/template_type");
const { BalanceLockTypeList } = require("./type_defs/balance_lock_type");
const InfoType = require("./type_defs/info_type");
const IdxRange = require("./type_defs/id_type");
const AccountType = require("./type_defs/account_type");

const { IdxRange64Args, IdxRange9664Args, listingArgs, IdxRange64Resolver, IdxRange9664Resolver, domainResolver, collectionResolver, shopResolver, categoryResolver, templateResolver, skuResolver, sku2Resolver, sku3Resolver, assetResolver, assetShopScopeResolver, auctionResolver, bidderResolver, offerResolver, balanceResolver, infoResolver } = require("./query/listing_resolvers");
const { accountInfoResolver } = require('./query/account_resolvers');

const accInfoArgs = {
    accName: { type: GraphQLString },
};

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        accinfo: {
            type: AccountType,
            args: accInfoArgs,
            async resolve(parent, args, context) {
                return accountInfoResolver(parent, args);
            },
        },
        IdxRange64: {
            type: IdxRange,
            args: IdxRange64Args,
            async resolve(parent, args, context) {
                return IdxRange64Resolver(parent, args);
            },
        },
        IdxRange9664: {
            type: IdxRange,
            args: IdxRange9664Args,
            async resolve(parent, args, context) {
                return IdxRange9664Resolver(parent, args);
            },
        },

        collections: {
            type: CollectionTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return collectionResolver(parent, args);
            },
        },
        domains: {
            type: DomainTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return domainResolver(parent, args);
            },
        },
        shops: {
            type: ShopTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return shopResolver(parent, args);
            },
        },
        templates: {
            type: TemplateTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return templateResolver(parent, args);
            },
        },
        categories: {
            type: CategoryTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return categoryResolver(parent, args);
            },
        },
        skus: {
            type: SkuTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return skuResolver(parent, args);
            },
        },
        skus2: {
            type: SkuTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return sku2Resolver(parent, args);
            },
        },
        skus3: {
            type: SkuTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return sku3Resolver(parent, args);
            },
        },
        assets: {
            type: AssetTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return assetResolver(parent, args);
            },
        },
        shopassets: {
            type: AssetTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return assetShopScopeResolver(parent, args);
            },
        },
        auctions: {
            type: AuctionTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return auctionResolver(parent, args);
            },
        },
        bidders: {
            type: BidderTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return bidderResolver(parent, args);
            },
        },
        offers: {
            type: OfferTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return offerResolver(parent, args);
            },
        },
        balanceLock: {
            type: BalanceLockTypeList,
            args: listingArgs,
            async resolve(parent, args, context) {
                return balanceResolver(parent, args);
            },
        },
        info: {
            type: InfoType,
            async resolve(parent, args, context) {
                return infoResolver();
            },
        },
    },
});


module.exports = RootQuery;
