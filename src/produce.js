const Config = require("../config.json");
const Util = require("./utilities");
const { performance } = require("perf_hooks");
const start = performance.now();
const Filesystem = require("graceful-fs");
const Path = require("path");
const Logger = require("logplease");
const logger = Logger.create("Produce", Config.logplease);

const Transformers = {};
for (const extension in Config.transformers) {
  Transformers[extension] = require(Config.transformers[extension]);
}

if (
  !Filesystem.existsSync(Path.resolve(process.cwd(), Config.stores.processed))
) {
  logger.error(`${Config.stores.processed} does not exist`);
  process.exit(1);
}

const data = JSON.parse(
  Filesystem.readFileSync(
    Path.resolve(process.cwd(), Config.stores.processed),
    {
      encoding: "utf8",
      flag: "r",
    }
  )
);
if (data.length < 1) {
  logger.error(`No data to iterate`);
  process.exit(1);
}

data.forEach((item) => {
  if (!item.hasOwnProperty("path")) {
    return;
  }
  const source = Path.resolve(
    process.cwd(),
    `${Config.baseDirectory}/${item.path}`
  );
  const filename = Path.basename(item.path);
  let target = Path.resolve(
    process.cwd(),
    `${Config.outputDirectory}/content/${item.path}`
  );
  const Stats = Filesystem.statSync(source);
  if (Stats.isDirectory()) {
    Filesystem.mkdirSync(target, { recursive: true }, (error) => {
      if (error) {
        logger.error(error);
        process.exit(0);
      }
    });
  } else if (Stats.isFile()) {
    if (
      item.hasOwnProperty("extension") &&
      Transformers.hasOwnProperty(item.extension)
    ) {
      Transformers[item.extension](source, target);
    } else {
      Filesystem.copyFile(source, target, (error) => {
        if (error) {
          logger.error(error);
          process.exit(0);
        }
      });
      logger.info(`Copied ${filename} to ${target}`);
    }
  }
});
logger.info(
  `Iterating ${data.length} items in ${Util.msToTime(
    performance.now() - start
  )}`
);
