const {send, sendError, buffer} = require('micro');
const HTTPStatus = require('../../lib/HTTPStatus');
const OPTIONS = {limit: '10mb', encoding: 'utf8'};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 30.01.2019
 * Time: 17:39
 */
module.exports = async ({req, res, query, store}) => {
    const {v: version, n: name} = query;
    const exists = store.has(version, name);

    if (exists) {
        return send(res, HTTPStatus.CONFLICT);
    }

    try {
        const file = store.create(version, name);

        if (!file) {
            return send(res, HTTPStatus.CONFLICT);
        }

        const buffered = await buffer(req, OPTIONS);
        const success = file.write(buffered);

        return (success)
            ? send(res, HTTPStatus.CREATED)
            : send(res, HTTPStatus.BAD_REQUEST)
        ;
    } catch (e) {
        store.delete(version, name);

        sendError(req, res, e);
    }
};
