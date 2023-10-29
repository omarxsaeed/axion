module.exports = {
  createUser: [
    {
      label: "username",
      model: "username",
      type: "string",
      required: true,
    },
    {
      label: "email",
      model: "email",
      type: "string",
      // Should be set to true but there's a bug in the validator that keeps asking for an email even though it's provided
      required: false,
      regex: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$",
    },
    {
      label: "password",
      model: "password",
      type: "string",
      required: true,
    },
  ],
};
