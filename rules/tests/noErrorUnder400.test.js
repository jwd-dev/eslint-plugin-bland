const { RuleTester } = require("eslint");
const noErrorUnder400 = require("../noErrorUnder400");
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2021,
    sourceType: "module",
  },
});
ruleTester.run("no-generic-try-catch", noErrorUnder400, {
  valid: [
    {
      code: `
      instance.post("/fake", async (req, res) => {
        return responseHandler({
			res: res,
			status: 400,
			data: {
				status: "success",
				data: {
					message: "This is a fake endpoint",
				},
			}		});
});`,
    },
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
			  },
			  errors: null,		});
  });`,
	  },
	  {
		code: `
		instance.post("/fake", async (req, res) => {
		  return responseHandler({
			  res: res,
			  status: 500,
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
},
				  errors: [
				  {
				  	error: "UNKNOWN_ERROR",
					message: "An unknown error occurred",
				  }]
			  		});
  });`,
      errors: [
        {
          message: "Errors should not be defined when status is under 400.",
        },
      ],
    },
  ],
});
