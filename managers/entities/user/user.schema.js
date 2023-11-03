module.exports = {
  createUser: [
    {
      label: "Username",
      model: "username",
      type: "string",
      required: true,
    },
    {
      label: "Email",
      model: "email",
      required: true,
    },
    {
      label: "Password",
      model: "password",
      type: "string",
      required: true,
    },
    {
      label: "Role",
      model: "role",
      type: "string",
      required: true,
    },
  ],
};
