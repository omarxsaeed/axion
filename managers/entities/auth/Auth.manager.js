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

  async signup({ username, email, password }) {
    let userInfo = {
      username,
      email,
      password,
      role: "super_admin",
    };

    let validationResult = await this.validators.auth.signUp(userInfo);
    if (validationResult) return validationResult;

    const user = await this.mongomodels.user.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return {
        ok: false,
        code: 409,
        errors: "User with this username or email already exists.",
      };
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

    newUser.password = undefined;

    return { newUser, access_token };
  }
  async login({ email, password }) {
    const userInfo = {
      email,
      password,
    };

    let validationResult = await this.validators.auth.login(userInfo);
    if (validationResult) return validationResult;

    let user = await this.mongomodels.user.findOne({ email }).select("+password");

    if (!user) {
      return {
        ok: false,
        code: 400,
        errors: "Wrong email or password.",
      };
    }

    let passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        ok: false,
        code: 400,
        errors: "Wrong email or password.",
      };
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
