const bcrypt = require("bcrypt");

module.exports = class Auth {
  constructor({ utils, cache, config, cortex, managers, validators, mongomodels }) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "auth";
    this.httpExposed = ["post=login", "post=signup"];
  }

  async signup({ username, email, password, role = "super_admin" }) {
    let userInfo = {
      username,
      email,
      password,
      role,
    };

    let validationResult = await this.validators.user.createUser(userInfo);
    if (validationResult) return validationResult;

    const user = await this.mongomodels.user.findOne({ $or: [{ username }, { email }] });
    if (user) {
      throw new Error("User already exists");
    }

    userInfo.password = await bcrypt.hash(password, 12);

    let newUser = await this.mongomodels.user.create(userInfo);

    const access_token = this.tokenManager.genLongToken({
      userId: newUser._id,
      userKey: {
        email: newUser.email,
        role: newUser.role,
      },
    });

    return { newUser, access_token };
  }
};
