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

    user.password = undefined;

    return { newUser, access_token };
  }
  async login({ email, password }) {
    let user = await this.mongomodels.user.findOne({ email }).select("+password");
    console.log("🚀 ~ file: Auth.manager.js:47 ~ Auth ~ login ~ user:", user);
    if (!user) {
      throw new Error("Wrong email or password");
    }

    let passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Wrong email or password");
    }

    const access_token = this.tokenManager.genLongToken({
      userId: user._id,
      userKey: {
        email: user.email,
        role: user.role,
      },
    });

    user.password = undefined;

    return { user, access_token };
  }
};
