module.exports = {
  signUp: [
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
  login: [
    {
      label: "email",
      model: "email",
      type: "string",
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
