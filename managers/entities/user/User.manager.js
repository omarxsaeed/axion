const bcrypt = require("bcrypt");

module.exports = class User {
  constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "user";
    this.httpExposed = ["post=createUser"];
  }

  async createUser({ username, email, password, role }) {
    const userInfo = { username, email, password, role };

    let result = await this.validators.user.createUser(userInfo);
    if (result) return result;

    const user = await this.mongomodels.user.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return {
        ok: false,
        code: 409,
        errors: "User with this username or email already exists.",
      };
    }

    userInfo.password = await bcrypt.hash(password, 12);

    let createdUser = await this.mongomodels.user.create(userInfo);

    return {
      user: createdUser,
    };
  }
};
