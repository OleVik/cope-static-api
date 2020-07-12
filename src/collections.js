const Config = require("../config.json");
const Filesystem = require("graceful-fs");

if (!Filesystem.existsSync(Config.stores.index)) {
  logger.error(`${Config.stores.index} does not exist`);
  process.exit(1);
}

Filesystem.readFile(
  Path.resolve(process.cwd(), Config.stores.index),
  (error, data) => {
    if (error) {
      throw error;
    }
    data.forEach((item) => {});
  }
);
