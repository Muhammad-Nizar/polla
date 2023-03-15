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
const { table_page } = require('../../utilities/blockchain/listing_tables');
const { tbls } = require('../config');
const { AssetTypeList } = require("../type_defs/asset_type");
const { AuctionTypeList } = require("../type_defs/auction_type");
const { CategoryTypeList } = require("../type_defs/category_type");
const { CollectionTypeList } = require("../type_defs/collection_type");
const { DomainTypeList } = require("../type_defs/domain_type");
const { OfferTypeList } = require("../type_defs/offer_type");
const { ShopTypeList } = require("../type_defs/shop_type");
const { SkuTypeList } = require("../type_defs/sku_type");
const { TemplateTypeList } = require("../type_defs/template_type");
const { BalanceLockTypeList } = require("../type_defs/balance_lock_type");
const InfoType = require("../type_defs/info_type");

function oneRow(args) {
    if (args.id != null) {
        args.limit = 1;
        args.start = args.id;
        args.end = args.id;
        args.idx_type = args.idx_type;
        args.idx = 1;
    }
    return args;
}

async function domain_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page(tbls.domain, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    DomainTypeList.data = v.rows;
    DomainTypeList.more = v.more;
    DomainTypeList.next_key = v.next_key != '' ? v.next_key : null;
    return DomainTypeList;
}

async function collection_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page(tbls.collection, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    CollectionTypeList.data = v.rows;
    CollectionTypeList.more = v.more;
    CollectionTypeList.next_key = v.next_key != '' ? v.next_key : null;
    return CollectionTypeList;
}

async function shop_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page(tbls.shop, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    ShopTypeList.data = v.rows;
    ShopTypeList.more = v.more;
    ShopTypeList.next_key = v.next_key != '' ? v.next_key : null;

    ShopTypeList.data = ShopTypeList.data.map(async element => {
        var d = await table_page(tbls.domain, true, 1, element.domain_id, element.domain_id, 1);
        var c = await table_page(tbls.category, true, 100, element.id, null, 2);
        var t = await table_page(tbls.template, true, 100, element.id, null, 2);

        return {
            ...element,
            domain: d.rows[0],
            categories: c.rows,
            templates: t.rows,
        };
    });

    return ShopTypeList;
}

async function category_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page(tbls.category, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    CategoryTypeList.data = v.rows;
    CategoryTypeList.more = v.more;
    CategoryTypeList.next_key = v.next_key != '' ? v.next_key : null;
    return CategoryTypeList;
}

async function template_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page(tbls.template, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    TemplateTypeList.data = v.rows;
    TemplateTypeList.more = v.more;
    TemplateTypeList.next_key = v.next_key != '' ? v.next_key : null;
    return TemplateTypeList;
}

async function sku_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page(tbls.sku, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    SkuTypeList.data = v.rows;
    SkuTypeList.more = v.more;
    SkuTypeList.next_key = v.next_key != '' ? v.next_key : null;

    SkuTypeList.data = SkuTypeList.data.map(async element => {
        var c = await table_page(tbls.collection, true, 1, element.domain_id, element.domain_id);
        var t = await table_page(tbls.template, true, 1, element.template_id, element.template_id);
        var s = await table_page(tbls.shop, true, 1, element.shop_id, element.shop_id);

        return {
            ...element,
            collection: c.rows[0],
            template: t.rows[0],
            shop: s.rows[0],
        };
    });

    return SkuTypeList;
}

async function asset_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page(tbls.asset, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    AssetTypeList.data = v.rows;
    AssetTypeList.more = v.more;
    AssetTypeList.next_key = v.next_key != '' ? v.next_key : null;

    AssetTypeList.data = AssetTypeList.data.map(async element => {
        var c = await table_page(tbls.category, true, 1, element.category_id, element.category_id);
        var co = await table_page(tbls.collection, true, 1, element.collection_id, element.collection_id);
        var s = await table_page(tbls.sku, true, 1, element.sku_id, element.sku_id);

        var _t = await table_page(tbls.template, true, 1, s.rows[0].template_id, s.rows[0].template_id);
        var _s = await table_page(tbls.shop, true, 1, c.rows[0].shop_id, c.rows[0].shop_id);

        return {
            ...element,
            category: c.rows[0],
            collection: co.rows[0],
            sku: s.rows[0],
            template: _t.rows[0],
            shop: _s.rows[0],
        };
    });

    return AssetTypeList;
}

async function auction_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page(tbls.auction, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    AuctionTypeList.data = v.rows;
    AuctionTypeList.more = v.more;
    AuctionTypeList.next_key = v.next_key != '' ? v.next_key : null;

    AuctionTypeList.data = AuctionTypeList.data.map(async element => {
        var b = await table_page(tbls.bidder, true, 1000, element.asset_id, null, 2);

        var a = await table_page(tbls.asset, true, 1, element.asset_id, element.asset_id);

        var c = await table_page(tbls.category, true, 1, a.rows[0].category_id, a.rows[0].category_id);
        var s = await table_page(tbls.sku, true, 1, a.rows[0].sku_id, a.rows[0].sku_id);
        var co = await table_page(tbls.collection, true, 1, s.rows[0].collection_id, s.rows[0].collection_id);
        var _t = await table_page(tbls.template, true, 1, co.rows[0].template_id, co.rows[0].template_id);
        var _s = await table_page(tbls.shop, true, 1, co.rows[0].shop_id, co.rows[0].shop_id);

        return {
            ...element,
            asset: a.rows[0],
            category: c.rows[0],
            sku: s.rows[0],
            collection: co.rows[0],
            template: _t.rows[0],
            shop: _s.rows[0],
            bidders_list: b.rows
        };
    });

    return AuctionTypeList;
}

async function offer_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page("offers.11", args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    OfferTypeList.data = v.rows;
    OfferTypeList.more = v.more;
    OfferTypeList.next_key = v.next_key != '' ? v.next_key : null;

    OfferTypeList.data = OfferTypeList.data.map(async element => {
        var c = await table_page(tbls.category, true, 1, element.category_id, element.category_id);
        var co = await table_page(tbls.collection, true, 1, element.collection_id, element.collection_id);
        var s = await table_page(tbls.sku, true, 1, element.sku_id, element.sku_id);

        var _t = await table_page(tbls.template, true, 1, s.rows[0].template_id, s.rows[0].template_id);
        var _s = await table_page(tbls.shop, true, 1, c.rows[0].shop_id, c.rows[0].shop_id);

        return {
            ...element,
            category: c.rows[0],
            collection: co.rows[0],
            sku: s.rows[0],
            template: _t.rows[0],
            shop: _s.rows[0],
        };
    });

    return OfferTypeList;
}


async function balance_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page(tbls.balancelock, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    BalanceLockTypeList.data = v.rows;
    BalanceLockTypeList.more = v.more;
    BalanceLockTypeList.next_key = v.next_key != '' ? v.next_key : null;
    return BalanceLockTypeList;
}



async function info_resolver() {
    var v = await table_page(tbls.info);
    return v.rows[0];
}


module.exports.infoResolver = info_resolver;
module.exports.balanceResolver = balance_resolver;
module.exports.auctionResolver = auction_resolver;
module.exports.offerResolver = offer_resolver;
module.exports.assetResolver = asset_resolver;
module.exports.skuResolver = sku_resolver;
module.exports.shopResolver = shop_resolver;
module.exports.templateResolver = template_resolver;
module.exports.categoryResolver = category_resolver;
module.exports.domainResolver = domain_resolver;
module.exports.collectionResolver = collection_resolver;
module.exports.listingArgs = {
    id: { type: GraphQLInt, defaultValue: null },
    limit: { type: GraphQLInt, defaultValue: null },
    reverse: { type: GraphQLBoolean, GraphQLID, defaultValue: false },
    start: { type: GraphQLInt, defaultValue: null },
    end: { type: GraphQLInt, defaultValue: null },
    idx: { type: GraphQLInt, defaultValue: null },
    idx_type: { type: GraphQLString, defaultValue: null },
}