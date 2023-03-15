const Owner = require('../models/owner');
const env = require('../config/env');
const apiResponse = require('../utilities/response');
var { mysqlPlanetScale } = require('../utilities/database');

function any(req, res, next) {
    next();
}

async function owner(req, res, next) {
    if (env.forbeddenIPs.length > 0 && !env.forbeddenIPs.includes(req.ip)) {
        return res.set(env.customHeaders).status(403).send(apiResponse(null, 41, true, 'Not allowed IP'));
    }
    var token = null
    const authHeader = req.header('authorization');
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7, authHeader.length);
    }
    if (!token) {
        return res.set(env.customHeaders).status(403).send(apiResponse(null, 41, true, 'Not authorized'));
    } {
        mysqlPlanetScale.query("SELECT * FROM polauth WHERE type = 'owner' AND token = '" + token + "'", function(err, result, fields) {
            if (err) throw err;
            const auth = result[0];
            console.log(auth)
            if (!auth || (auth.type != "owner" && auth.type != "admin")) {
                return res.set(env.customHeaders).status(403).send(apiResponse(null, 41, true, 'Not authorized'));
            } else {
                // get owner record from BC
                req.header['miid'] = auth.miid;
                req.header['uuid'] = auth.uuid;
                console.log(req.header['uuid'])
                next();
            }
        });
    }
}

async function admin(req, res, next) {
    if (env.forbeddenIPs.length > 0 && !env.forbeddenIPs.includes(req.ip)) {
        return res.set(env.customHeaders).status(403).send(apiResponse(null, 41, true, 'Not allowed IP'));
    }
    var token = null
    const authHeader = req.header('authorization');
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7, authHeader.length);
    }
    if (!token) {
        return res.set(env.customHeaders).status(403).send(apiResponse(null, 41, true, 'Not authorized'));
    } {
        const auth = await auth.findByAuthToken(token);
        if (!auth || auth.auth.split("@")[0] != "qwpokn12345r") {
            return res.set(env.customHeaders).status(403).send(apiResponse(null, 41, true, 'Not authorized'));
        } else {
            next();
        }
    }
}

module.exports.owner = owner;
module.exports.admin = admin;
module.exports.any = any;