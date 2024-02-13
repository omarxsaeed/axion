module.exports = class Classroom {
  constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "school";
    this.httpExposed = [
      "post=createClassroom",
      "get=getClassrooms",
      "get=getClassroom",
      "patch=updateClassroom",
      "delete=deleteClassroom",
    ];
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

  async getClassroom({ id }) {
    const cacheKey = `classroom:${id}`;
    const cachedClassroom = await this.cache.key.get({ key: cacheKey });

    if (cachedClassroom) {
      return { classroom: JSON.parse(cachedClassroom) };
    }

    let classroom = await this.mongomodels.classroom.findById(id);

    await this.cache.key.set({
      key: cacheKey,
      data: JSON.stringify(classroom),
      ttl: this.cacheExpired,
    });

    return { classroom };
  }

  async updateClassroom({ __longToken, __authorization, id, name, school, students }) {
    const classroomInfo = { name, school, students };

    let result = await this.validators.classroom.updateClassroom(classroomInfo);
    if (result) return result;

    let updatedClassroom = await this.mongomodels.classroom.findByIdAndUpdate(id, classroomInfo, {
      new: true,
    });
    await this.cache.key.delete({ key: "classrooms" });
    await this.cache.key.delete({ key: `classroom:${id}` });

    return {
      classroom: updatedClassroom,
    };
  }

  async deleteClassroom({ __longToken, __authorization, id }) {
    let deletedClassroom = await this.mongomodels.classroom.findByIdAndDelete(id);
    await this.cache.key.delete({ key: "classrooms" });
    await this.cache.key.delete({ key: `classroom:${id}` });

    return {
      classroom: deletedClassroom,
    };
  }
};
