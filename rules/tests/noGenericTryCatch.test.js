const { RuleTester } = require("eslint");
const noGenericTryCatch = require("../noGenericTryCatch");
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2021,
    sourceType: "module",
  },
});
ruleTester.run("no-generic-try-catch", noGenericTryCatch, {
  valid: [
    {
      code: `
      instance.post("/fake", async (req, res) => {
        return responseHandler({
			res: res,
			status: 200,
			data: {
				status: "success",
				data: {
					message: "This is a fake endpoint",
				},
			}		});
});`,
    },
  ],
  invalid: [
    {
      code: `instance.post("/fake", async (req, res) => {
	try {
		return responseHandler({
			res: res,
			status: 200,
			data: {
				status: "success",
				data: {
					message: "This is a fake endpoint",
				},
			},
			errors: null,
		});
	} catch (e) {
		return responseHandler({
			res: res,
			status: 500,
			data: null,
			errors: [
				{
					error: "UNKNOWN_ERROR",
					message: "An unknown error occurred",
					source: e,
				},
			],
		});
	}
});`,
      errors: [
        {
          message:
            "Avoid wrapping the entire function in a try-catch that only returns a generic error response.",
        },
      ],
    },
  ],
});
