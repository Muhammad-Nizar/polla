function writeApiResponse(data, code = 1, error = false, msg = 'success') {
    return {error: error, code: code, message: msg, data: data};
}
module.exports = writeApiResponse;