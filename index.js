module.exports = {
    rules: {
        "response-handler-error-source": require('./rules/responseHandlerErrorSource'),
        "no-generic-try-catch": require('./rules/noGenericTryCatch')
    }
};