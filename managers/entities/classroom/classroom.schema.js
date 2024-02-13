module.exports = {
  createClassroom: [
    {
      label: "Name",
      model: "name",
      type: "string",
      required: true,
    },
    {
      label: "School",
      model: "school",
      type: "string",
      required: true,
    },
    {
      label: "Students",
      model: "students",
      type: "array",
      required: false,
    },
  ],
};
