const fs = require("fs"),
  path = require("path"),
  filePath = path.join(__dirname, "../database/db.json");

const db = {
  async read(id = null) {
    let data = (await fs.promises.readFile(filePath, "utf8")) || false;
    if (data && id) {
      let dataParse = JSON.parse((await this.read()) || false);
      data = dataParse.find((item) => item.id === id);
    }
    return data;
  },
  async create(param) {
    let data = JSON.parse((await this.read()) || false);

    let item = [];
    if (Array.isArray(data)) {
      item = data;
      item.push(param);
    } else {
      item.push(param);
    }

    return fs.writeFileSync(filePath, JSON.stringify(item, null, 2), "utf8");
  },
  async delete(id) {
    let data = JSON.parse((await this.read()) || false);
    if (!data) return data;
    let item = data.filter((data) => data.id !== id);
    return fs.writeFileSync(filePath, JSON.stringify(item, null, 2), "utf8");
  },
};
module.exports = db;
