const bcrypt = require("bcrypt");

module.exports = class User {
  constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "user";
    this.httpExposed = ["post=createUser", "get=getMe", "get=getUser", "patch=updateUser"];
    this.cache = cache;
  }

  async createUser({ __longToken, __authorization, username, email, password, role }) {
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

  async getMe({ __longToken }) {
    const userId = __longToken.userId;
    const cacheKey = `user:${userId}`;

    const cachedUser = await this.cache.key.get({ key: `user:${userId}` });

    if (cachedUser) {
      return { user: JSON.parse(cachedUser) };
    }

    const user = await this.mongomodels.user.findById(userId);

    await this.cache.key.set({
      key: cacheKey,
      data: JSON.stringify(user),
      ttl: this.cacheExpired,
    });

    return { user };
  }

  async getUser({ userId }) {
    const cacheKey = `user:${userId}`;
    const cachedUser = await this.cache.key.get({ key: `user:${userId}` });

    if (cachedUser) {
      return { user: JSON.parse(cachedUser) };
    }

    const user = await this.mongomodels.user.findById(userId);
    await this.cache.key.set({
      key: cacheKey,
      data: JSON.stringify(user),
      ttl: this.cacheExpired,
    });

    return { user };
  }

  async updateUser({ __longToken, username, email, password }) {
    const userInfo = { username, email, password };
    const userId = __longToken.userId;
    const cacheKey = `user:${userId}`;

    let result = await this.validators.user.updateUser(userInfo);
    if (result) return result;

    const user = await this.mongomodels.user.findByIdAndUpdate(userId, userInfo, { new: true });

    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 12);

    await user.save();

    await this.cache.key.set({
      key: cacheKey,
      data: JSON.stringify(user),
      ttl: this.cacheExpired,
    });

    return { user };
  }
};
