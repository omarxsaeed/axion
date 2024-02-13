module.exports = class Classroom {
  constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "school";
    this.httpExposed = ["post=createClassroom", "get=getClassrooms"];
    this.cache = cache;
  }

  async createClassroom({ __longToken, __authorization, name, school, students }) {
    const classroomInfo = { name, school, students };

    let result = await this.validators.classroom.createClassroom(classroomInfo);
    if (result) return result;

    const classroom = await this.mongomodels.classroom.findOne({ $and: [{ name }, { school }] });
    if (classroom) {
      return {
        ok: false,
        code: 409,
        errors: "Classroom with this name in this school already exists.",
      };
    }

    let createdClassroom = await this.mongomodels.classroom.create(classroomInfo);
    await this.cache.key.delete({ key: "classrooms" });

    return {
      classroom: createdClassroom,
    };
  }

  async getClassrooms() {
    const cacheKey = `classrooms`;
    const cachedClassrooms = await this.cache.key.get({ key: cacheKey });

    if (cachedClassrooms) {
      return { classrooms: JSON.parse(cachedClassrooms) };
    }

    let classrooms = await this.mongomodels.classroom.find();

    await this.cache.key.set({
      key: cacheKey,
      data: JSON.stringify(classrooms),
      ttl: this.cacheExpired,
    });

    return { classrooms };
  }
};
