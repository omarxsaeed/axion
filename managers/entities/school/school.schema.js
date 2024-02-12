module.exports = {
  createSchool: [
    {
      label: "Name",
      model: "name",
      type: "string",
      required: true,
    },
    {
      label: "Address",
      model: "address",
      type: "string",
      required: true,
    },
    {
      label: "Administrator",
      model: "administrator",
      type: "string",
      required: true,
    },
  ],
  updateSchool: [
    {
      label: "Name",
      model: "name",
      type: "string",
      required: false,
    },
    {
      label: "Address",
      model: "address",
      type: "string",
      required: false,
    },
    {
      label: "Administrator",
      model: "administrator",
      type: "string",
      required: false,
    },
  ],
};
