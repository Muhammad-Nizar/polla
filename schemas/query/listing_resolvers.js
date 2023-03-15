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
const { idx_range64, idx_range9664 } = require('../../utilities/blockchain/helpers');
const { transaction } = require('../../utilities/blockchain/transaction');
const { tbls } = require('../config');

const { AssetTypeList } = require("../type_defs/asset_type");
const { AuctionTypeList } = require("../type_defs/auction_type");
const { BidderTypeList } = require("../type_defs/bidder_type");
const { CategoryTypeList } = require("../type_defs/category_type");
const { CollectionTypeList } = require("../type_defs/collection_type");
const { DomainTypeList } = require("../type_defs/domain_type");
const { OfferTypeList } = require("../type_defs/offer_type");
const { ShopTypeList } = require("../type_defs/shop_type");
const { SkuTypeList } = require("../type_defs/sku_type");
const { TemplateTypeList } = require("../type_defs/template_type");
const { BalanceLockTypeList } = require("../type_defs/balance_lock_type");
const InfoType = require("../type_defs/info_type");

const IdxRange = require("../type_defs/id_type");

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

async function get_pgsync_patch(limit) {
    var v = await table_page("pgsync", false, limit);
    return v.rows;
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

async function shop_resolver(parent, args, light = false) {
    args = oneRow(args);
    var v = await table_page(tbls.shop, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    ShopTypeList.data = v.rows;
    ShopTypeList.more = v.more;
    ShopTypeList.next_key = v.next_key != '' ? v.next_key : null != '' ? v.next_key : null;
    if (light) {
        return ShopTypeList
    } else {
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
    TemplateTypeList.data = TemplateTypeList.data.map(async element => {
        var s = await table_page(tbls.shop, true, 1, element.shop_id, element.shop_id, 1);
        return {
            ...element,
            shop: s.rows[0],
        };
    });
    TemplateTypeList.more = v.more;
    TemplateTypeList.next_key = v.next_key != '' ? v.next_key : null;
    return TemplateTypeList;
}

async function sku_resolver(parent, args) {
    if (args.idx && args.idx > 17 && args.idx < 2 * 17) {
        args.idx = args.idx - 17;
        return _sku_resolver(tbls.sku_2, parent, args);
    } else if (args.idx && args.idx > 2 * 17) {
        args.idx = args.idx - 2 * 17;
        return _sku_resolver(tbls.sku_3, parent, args);
    } else {
        return _sku_resolver(tbls.sku, parent, args);
    }

}

async function sku_2_resolver(parent, args) {
    return _sku_resolver(tbls.sku_2, parent, args);
}

async function sku_3_resolver(parent, args) {
    return _sku_resolver(tbls.sku_3, parent, args);
}

async function _sku_resolver(tbl, parent, args) {
    args = oneRow(args);
    var v = await table_page(tbl, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    SkuTypeList.data = v.rows;
    SkuTypeList.more = v.more;
    SkuTypeList.next_key = v.next_key != '' ? v.next_key : null;

    SkuTypeList.data = SkuTypeList.data.map(async element => {
        var c = await table_page(tbls.collection, true, 1, element.collection_id, element.collection_id);
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
    return _asset_resolver(tbls.asset, parent, args);
}

async function asset_shop_scope_resolver(parent, args) {
    return _asset_resolver(tbls.asset_shop_scope, parent, args);
}

async function _asset_resolver(tbl, parent, args) {
    args = oneRow(args);
    var v = await table_page(tbl, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type, args.scope);
    AssetTypeList.data = v.rows;
    AssetTypeList.more = v.more;
    AssetTypeList.next_key = v.next_key != '' ? v.next_key : null;

    AssetTypeList.data = AssetTypeList.data.map(async element => {
        var c = await table_page(tbls.category, true, 1, element.category_id, element.category_id);
        var co = await table_page(tbls.collection, true, 1, element.collection_id, element.collection_id);
        var s = await table_page(tbls.sku, true, 1, element.sku_id, element.sku_id);

        var _t = await table_page(tbls.template, true, 1, s.rows[0].template_id, s.rows[0].template_id);
        var _s = await table_page(tbls.shop, true, 1, element.shop_id, element.shop_id);

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
        var _s = await table_page(tbls.shop, true, 1, a.rows[0].shop_id, a.rows[0].shop_id);

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

async function bidder_resolver(parent, args) {
    args = oneRow(args);
    var v = await table_page(tbls.bidder, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    BidderTypeList.data = v.rows;
    BidderTypeList.more = v.more;
    BidderTypeList.next_key = v.next_key != '' ? v.next_key : null;

    BidderTypeList.data = BidderTypeList.data.map(async element => {
        var a = await table_page(tbls.asset, true, 1, element.asset_id, element.asset_id);
        var au = await table_page(tbls.auction, true, 1, element.auction_id, element.auction_id);
        return {
            ...element,
            asset: a.rows[0],
            aution: au.rows[0],
        };
    });
    return BidderTypeList;
}

async function offer_resolver(parent, args) {
    args = oneRow(args);

    var v = await table_page(tbls.offer, args.reverse, args.limit, args.start, args.end, args.idx, args.idx_type);
    OfferTypeList.data = v.rows;
    OfferTypeList.more = v.more;
    OfferTypeList.next_key = v.next_key != '' ? v.next_key : null;

    OfferTypeList.data = OfferTypeList.data.map(async element => {
        var c = await table_page(tbls.category, true, 1, element.category_id, element.category_id);
        var co = await table_page(tbls.collection, true, 1, element.collection_id, element.collection_id);
        var s = await table_page(tbls.sku, true, 1, element.sku_id, element.sku_id);
        var _a = await table_page(tbls.asset, true, 1, element.asset_id, element.asset_id);

        var _t = await table_page(tbls.template, true, 1, s.rows[0].template_id, s.rows[0].template_id);
        var _s = await table_page(tbls.shop, true, 1, c.rows[0].shop_id, c.rows[0].shop_id);

        return {
            ...element,
            category: c.rows[0],
            collection: co.rows[0],
            sku: s.rows[0],
            template: _t.rows[0],
            shop: _s.rows[0],
            asset: _a.rows[0],
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
    var obj = await transaction("getinfo", null);
    const v = JSON.parse(obj);
    InfoType.total_shops = v.total_shops;
    InfoType.total_verified_shops = v.total_verified_shops;
    InfoType.total_active_auctions = v.total_active_auctions;
    InfoType.total_auctions = v.total_auctions;
    InfoType.total_offers = v.total_offers;
    InfoType.total_active_offers = v.total_active_offers;
    InfoType.burned_assets = v.burned_assets;
    InfoType.total_purchase = v.total_purchase;
    InfoType.total_income = v.total_income;
    InfoType.total_transfer = v.total_transfer;
    InfoType.total_assets = v.total_assets;
    InfoType.total_verified_skus = v.total_verified_skus;
    InfoType.total_skus = v.total_skus;
    return InfoType;
}

async function IdxRange64_resolver(parent, args) {
    var v = await idx_range64(args.left1, args.right1, args.left2, args.right2);
    const vals = v.split("_");
    IdxRange.idxStart = vals[0];
    IdxRange.idxEnd = vals[1];
    return IdxRange;
}

async function IdxRange9664_resolver(parent, args) {
    var v = await idx_range9664(args.left1, args.mid1, args.right1, args.left2, args.mid2, args.right2);
    const vals = v.split("_");
    IdxRange.idxStart = vals[0];
    IdxRange.idxEnd = vals[1];
    return IdxRange;
}

module.exports.infoResolver = info_resolver;
module.exports.balanceResolver = balance_resolver;
module.exports.auctionResolver = auction_resolver;
module.exports.bidderResolver = bidder_resolver;
module.exports.offerResolver = offer_resolver;
module.exports.assetResolver = asset_resolver;
module.exports.assetShopScopeResolver = asset_shop_scope_resolver;
module.exports.skuResolver = sku_resolver;
module.exports.sku2Resolver = sku_2_resolver;
module.exports.sku3Resolver = sku_3_resolver;
module.exports.shopResolver = shop_resolver;
module.exports.templateResolver = template_resolver;
module.exports.categoryResolver = category_resolver;
module.exports.domainResolver = domain_resolver;
module.exports.collectionResolver = collection_resolver;
module.exports.IdxRange64Resolver = IdxRange64_resolver;
module.exports.IdxRange9664Resolver = IdxRange9664_resolver;
module.exports.getPgsyncPatch = get_pgsync_patch;

module.exports.listingArgs = {
    id: { type: GraphQLID, defaultValue: null },
    limit: { type: GraphQLInt, defaultValue: null },
    reverse: { type: GraphQLBoolean, GraphQLID, defaultValue: false },
    start: { type: GraphQLID, defaultValue: null },
    end: { type: GraphQLID, defaultValue: null },
    idx: { type: GraphQLInt, defaultValue: null },
    idx_type: { type: GraphQLString, defaultValue: null },
    scope: { type: GraphQLString },

}
module.exports.IdxRange64Args = {
    left1: { type: GraphQLID, defaultValue: 0 },
    right1: { type: GraphQLID, defaultValue: 0 },
    left2: { type: GraphQLID, defaultValue: 0 },
    right2: { type: GraphQLID, defaultValue: 0 },
}
module.exports.IdxRange9664Args = {
    left1: { type: GraphQLID, defaultValue: 0 },
    mid1: { type: GraphQLID, defaultValue: 0 },
    right1: { type: GraphQLID, defaultValue: 0 },
    left2: { type: GraphQLID, defaultValue: 0 },
    mid2: { type: GraphQLID, defaultValue: 0 },
    right2: { type: GraphQLID, defaultValue: 0 },
}