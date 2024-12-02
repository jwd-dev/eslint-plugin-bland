module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ban instance.post/instance.get that wraps the entire function in a try-catch and returns a generic error",
            category: "Best Practices",
            recommended: false,
            fixable: "code"
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
                        const firstStatement = functionExpression.body.body[0];
                        const isWrappedInTryCatch = firstStatement && firstStatement.type === 'TryStatement';
                        
                        if (isWrappedInTryCatch) {
                            const tryStatement = firstStatement;
                            const catchClause = tryStatement.handler;
                            
                            if (catchClause) {
                                const onlyResponseHandler = catchClause.body.body.length === 1 &&
                                    catchClause.body.body[0]?.type === 'ReturnStatement' &&
                                    catchClause.body.body[0]?.argument?.callee?.name === 'responseHandler';

                                const responseHandlerArgs = catchClause.body.body[0].argument?.arguments?.[0];
                                const isGenericError = responseHandlerArgs &&
                                    responseHandlerArgs.properties?.some(prop => 
                                        prop.key.name === 'status' && prop.value.value === 500)

                                if (onlyResponseHandler && isGenericError) {
                                    context.report({
                                        node,
                                        message: "Avoid wrapping the entire function in a try-catch that only returns a generic error response.",
                                        fix: function(fixer) {
                                            const sourceCode = context.getSourceCode();
                                            const tryBlock = tryStatement.block;
                                            const tryBlockText = sourceCode.getText(tryBlock);
                                            return fixer.replaceText(tryStatement, tryBlockText.slice(1, -1));
                                        }
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