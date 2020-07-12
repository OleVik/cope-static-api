const Config = require("../config.json");
const Util = require("./utilities");
const { performance } = require("perf_hooks");
const start = performance.now();
const Filesystem = require("graceful-fs");
const Path = require("path");
const WalkSync = require("walk-sync");
const Logger = require("logplease");
const logger = Logger.create("Process", Config.logplease);

if (!Filesystem.existsSync(Path.resolve(process.cwd(), Config.baseDirectory))) {
  logger.error(`${Config.baseDirectory} does not exist`);
  process.exit(1);
}
if (
  !Filesystem.existsSync(Path.resolve(process.cwd(), Config.outputDirectory))
) {
  Filesystem.mkdirSync(Config.outputDirectory, { recursive: true }, (error) => {
    if (error) {
      logger.error(error);
      process.exit(0);
    }
  });
  logger.info(`Created ${Config.outputDirectory}`);
}

const contents = WalkSync(Config.baseDirectory);
const data = [];
contents.forEach((item) => {
  const Stats = Filesystem.statSync(
    Path.resolve(process.cwd(), `${Config.baseDirectory}/${item}`)
  );
  const info = {
    path: item,
    created: Stats.birthtime,
    modified: Stats.mtime,
  };
  if (Stats.isFile()) {
    info.extension = Path.extname(item);
    info.basename = Path.basename(item, info.extension);
  }
  data.push(info);
});

if (data.length < 1) {
  logger.error(`No data to write`);
  process.exit(1);
}

Filesystem.writeFile(Config.stores.processed, JSON.stringify(data), function (
  error
) {
  if (error) {
    throw error;
  }
  logger.info(
    `Wrote ${data.length} items to ${
      Config.stores.processed
    } in ${Util.msToTime(performance.now() - start)}`
  );
});
