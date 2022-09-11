const crypto = require("crypto");

module.exports = {
  todo: function (_) {
    return {
      id: crypto.randomUUID(),
      name: _.name,
      created: Date.now(),
    };
  },
};
