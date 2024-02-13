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
  updateClassroom: [
    {
      label: "Name",
      model: "name",
      type: "string",
      required: false,
    },
    {
      label: "School",
      model: "school",
      type: "string",
      required: false,
    },
    {
      label: "Students",
      model: "students",
      type: "array",
      required: false,
    },
  ],
};
