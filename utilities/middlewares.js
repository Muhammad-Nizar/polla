var uuid = require('node-uuid')

function reqMetaInfo(req, res, next) {
    req.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.time = Date.now();
    next();
}

function reqAssignId(req, res, next) {
    req.id = uuid.v4()
    next()
}


const opts = {
    points: 6,
    duration: 1,
};
const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory(opts);

function reqLimiter(req, res, next) {
    rateLimiter.consume("allIPs", 1).then((rateLimiterRes) => {
        next();
    }).catch((rateLimiterRes) => {
        res.set('Retry-After', String(Math.round(rateLimiterRes.msBeforeNext / 1000)));
        res.writeHead(429);
        res.end(JSON.stringify(rateLimiterRes));
    });
}

module.exports.reqMetaInfo = reqMetaInfo;
module.exports.reqAssignId = reqAssignId;
module.exports.reqLimiter = reqLimiter;