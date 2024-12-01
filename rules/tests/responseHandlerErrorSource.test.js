const { RuleTester } = require('eslint');
const responseHandlerErrorSource = require('../responseHandlerErrorSource');
const ruleTester = new RuleTester();
ruleTester.run('response-handler-error-source', responseHandlerErrorSource, {
    valid: [{
        code: 'try { foo() } catch (e) { bar() }',
    }],
    invalid: [{
        code: 'try { foo() } catch (e) {}',
        // we can use messageId from the rule object
        errors: [{ messageId: 'response-handler-error-source' }],
    }]
});