const bcrypt = require("bcrypt");

module.exports = class School {
  constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "school";
    this.httpExposed = ["post=createSchool"];
    this.cache = cache;
  }

  async createSchool({ __longToken, __authorization, name, address, administrator }) {
    const schoolInfo = { name, address, administrator };

    let result = await this.validators.school.createSchool(schoolInfo);
    if (result) return result;

    const school = await this.mongomodels.school.findOne({ $and: [{ name }, { address }] });
    if (school) {
      return {
        ok: false,
        code: 409,
        errors: "School with this name and address already exists.",
      };
    }

    let createdSchool = await this.mongomodels.school.create(schoolInfo);
    await this.cache.key.delete({ key: "schools" });

    return {
      school: createdSchool,
    };
  }
};
