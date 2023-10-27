module.exports = class Health {
  constructor({ config, cortex } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.usersCollection = "health";
    this.httpExposed = ["get=check"];
  }
  check = () => {
    return {
      message: "Server's healthy and running ⚡!",
    };
  };
};
