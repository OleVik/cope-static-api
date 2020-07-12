const Config = require("../config.json");
const Util = require("./utilities");
const { performance } = require("perf_hooks");
const start = performance.now();
const Filesystem = require("graceful-fs");
const Path = require("path");
const WalkSync = require("walk-sync");
const Logger = require("logplease");
const logger = Logger.create("Index", Config.logplease);

if (
  !Filesystem.existsSync(Path.resolve(process.cwd(), Config.outputDirectory))
) {
  logger.error(`${Config.stores.processed} does not exist`);
  process.exit(1);
}

const contents = WalkSync(Config.outputDirectory);
var data = new Set().add("index.json").add("processed.json");
contents.forEach((item) => {
  if (!Filesystem.existsSync(`${Config.outputDirectory}/${item}`)) {
    logger.warn(`${Config.outputDirectory}/${item} does not exist`);
    return;
  }
  const Stats = Filesystem.statSync(
    Path.resolve(process.cwd(), `${Config.outputDirectory}/${item}`)
  );
  if (Stats.isFile()) {
    data.add(item);
  }
});

data = Array.from(data);

if (data.length < 1) {
  logger.error(`No data to write`);
  process.exit(1);
}

Filesystem.writeFile(Config.stores.index, JSON.stringify(data), function (
  error
) {
  if (error) {
    throw error;
  }
  logger.info(
    `Wrote ${data.length} items to ${Config.stores.index} in ${Util.msToTime(
      performance.now() - start
    )}`
  );
});
