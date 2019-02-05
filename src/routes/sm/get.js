const {createReadStream: read} = require('fs');
const {send, sendError} = require('micro');

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 30.01.2019
 * Time: 17:39
 */
module.exports = async ({req, res, query, cache}) => {
    const {v: version, n: name} = query;
    const file = cache.get(version, name);

    if (!file) {
        return send(res, 404);
    }

    try {
        const stream = await read(file);
        send(res, 200, stream);
    } catch (e) {
        sendError(req, res, e);
    }
};