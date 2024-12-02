module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure responseHandler does not define errors if status is under 400",
            category: "Best Practices",
            recommended: false,
        },
        schema: [], // no options
    },
    create: function (context) {
        return {
            CallExpression(node) {
                if (node.callee && node.callee.name === 'responseHandler') {
                    const responseHandlerArgs = node.arguments[0];
                    if (responseHandlerArgs && responseHandlerArgs.type === 'ObjectExpression') {
                        const statusProperty = responseHandlerArgs.properties.find(prop => prop.key.name === 'status');
                        const errorsProperty = responseHandlerArgs.properties.find(prop => prop.key.name === 'errors');

                        if (statusProperty && statusProperty.value.value < 400 && errorsProperty) {
                            context.report({
                                node,
                                message: "Errors should not be defined when status is under 400.",
                            });
                        }
                    }
                }
            }
        };
    }
};