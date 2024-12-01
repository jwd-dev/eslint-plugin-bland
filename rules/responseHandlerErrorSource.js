module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure responseHandler calls in catch blocks have a source parameter",
            category: "Best Practices",
            recommended: false,
        },
        schema: [], // no options
    },
    create: function (context) {
        const sourceCode = context.getSourceCode();
        return {
            CallExpression(node) {
                const isResponseHandlerCall = node.callee.name === 'responseHandler';
                const isInCatchBlock = sourceCode.getAncestors(node).some(ancestor => ancestor.type === 'CatchClause');

                if (isResponseHandlerCall && isInCatchBlock) {
                    const hasSourceParam = node.arguments.some(arg => {
                        return arg.type === 'ObjectExpression' && arg.properties.some(prop => {
                            return prop.key.name === 'errors' && prop.value.elements.some(element => {
                                return element.type === 'ObjectExpression' && element.properties.some(innerProp => innerProp.key.name === 'source');
                            });
                        });
                    });

                    if (!hasSourceParam) {
                        context.report({
                            node,
                            message: "responseHandler call in catch block must have a 'source' parameter.",
                        });
                    }
                }
            }
        };
    }
};