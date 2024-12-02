module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ban instance.post/instance.get that wraps the entire function in a try-catch and returns a generic error",
            category: "Best Practices",
            recommended: false,
        },
        schema: [], // no options
    },
    create: function (context) {
        return {
            CallExpression(node) {
                const isInstancePostOrGet = node.callee && 
                    (node.callee.property?.name === 'post' || node.callee.property?.name === 'get');

                if (isInstancePostOrGet) {
                    const functionExpression = node.arguments.find(arg => arg.type === 'ArrowFunctionExpression');
                    if (functionExpression) {
                        const isWrappedInTryCatch = functionExpression.body.body.some(statement => statement.type === 'TryStatement');
                        
                        if (isWrappedInTryCatch) {
                            const tryStatement = functionExpression.body.body.find(statement => statement.type === 'TryStatement');
                            const catchClause = tryStatement && tryStatement.handler;
                            
                            if (catchClause) {
                                const onlyResponseHandler = catchClause.body.body.length === 1 &&
                                    catchClause.body.body[0].type === 'ReturnStatement' &&
                                    catchClause.body.body[0].argument.callee.name === 'responseHandler';

                                const responseHandlerArgs = catchClause.body.body[0].argument?.arguments?.[0];
                                const isGenericError = responseHandlerArgs &&
                                    responseHandlerArgs.properties.some(prop => 
                                        prop.key.name === 'status' && prop.value.value === 500)

                                if (onlyResponseHandler && isGenericError) {
                                    context.report({
                                        node,
                                        message: "Avoid wrapping the entire function in a try-catch that only returns a generic error response.",
                                    });
                                }
                            }
                        }
                    }
                }
            }
        };
    }
};