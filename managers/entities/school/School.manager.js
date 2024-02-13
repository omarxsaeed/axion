module.exports = class School {
  constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "school";
    this.httpExposed = [
      "post=createSchool",
      "get=getSchools",
      "get=getSchool",
      "patch=updateSchool",
      "delete=deleteSchool",
    ];
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

  async getSchools() {
    const cacheKey = `schools`;
    const cachedSchools = await this.cache.key.get({ key: cacheKey });

    if (cachedSchools) {
      return { schools: JSON.parse(cachedSchools) };
    }

    let schools = await this.mongomodels.school.find();

    await this.cache.key.set({
      key: cacheKey,
      data: JSON.stringify(schools),
      ttl: this.cacheExpired,
    });

    return { schools };
  }

  async getSchool({ id }) {
    const cacheKey = `school:${id}`;
    const cachedSchool = await this.cache.key.get({ key: cacheKey });

    if (cachedSchool) {
      return { school: JSON.parse(cachedSchool) };
    }

    let school = await this.mongomodels.school.findById(id);

    await this.cache.key.set({
      key: cacheKey,
      data: JSON.stringify(school),
      ttl: this.cacheExpired,
    });

    return { school };
  }

  async updateSchool({ __longToken, __authorization, id, name, address, administrator }) {
    const schoolInfo = { name, address, administrator };

    let result = await this.validators.school.updateSchool(schoolInfo);
    if (result) return result;

    let school = await this.mongomodels.school.findOneAndUpdate({ _id: id }, schoolInfo, { new: true });

    await this.cache.key.delete({ key: `school:${id}` });
    await this.cache.key.delete({ key: "schools" });
    return {
      school,
    };
  }

  async deleteSchool({ __longToken, __authorization, id }) {
    let school = await this.mongomodels.school.findByIdAndDelete(id);

    await this.cache.key.delete({ key: `school:${id}` });
    await this.cache.key.delete({ key: "schools" });
    return {
      school,
    };
  }
};
