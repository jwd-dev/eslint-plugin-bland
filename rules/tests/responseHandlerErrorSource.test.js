const { RuleTester } = require("eslint");
const responseHandlerErrorSource = require("../responseHandlerErrorSource");
const ruleTester = new RuleTester();
ruleTester.run("response-handler-error-source", responseHandlerErrorSource, {
  valid: [
    {
      code: `function test(res) {
        try {
          foo();
        } catch (error) {
          return responseHandler({
            res: res,
            status: 500,
            data: null,
            errors: [
              {
                error: "RUN_ERROR",
                message: "An error occurred while running the request",
                source: error
              }
            ]
          });
        }
      }`,
    },
    {
        code: `function test(res) {
            try {
              foo();
            } catch (error) {
              return responseHandler({
                res: res,
                status: 500,
                data: null,
                errors: null
              });
            }
          }`
      },
      {
        code: `function test(res) {
            try {
              foo();
            } catch (error) {
              return responseHandler({
                res: res,
                status: 500,
                data: null
              });
            }
          }`
      },
      {
        code: `function test(res) {
            try {
              foo();
            } catch (error) {
              return responseHandler({
                res: res,
                status: 500,
                data: null,
                errors: [
					{
						error: "STRIPE_WH_ERROR",
						message: 'Error validating Stripe webhook payload',
						source: err,
					},
				]
              });
            }
          }`
      },
      {
        code: `function test(res) {
            try {
              foo();
            } catch (error) {
		return responseHandler({
			res: res,
			status: 200,
			data: { phone_numbers: [] },
			errors: null,
		});
	}
      }`
      }
  ],
  invalid: [
    {
      code: `function test(res) {
        try { 
          foo(); 
        } catch (error) {
          return responseHandler({
            res: res,
            status: 500,
            data: null,
            errors: [
              {
                error: "RUN_ERROR",
                message: "An error occurred while running the request"
              }
            ]
          });
        }
      }`,
      errors: [
        {
          message:
            "responseHandler call in catch block must have a 'source' parameter.",
        },
      ],
    },
  ],
});
