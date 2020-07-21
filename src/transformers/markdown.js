const Config = require("../../config.json");
const Util = require("../utilities");
const { performance } = require("perf_hooks");
const start = performance.now();
const Filesystem = require("graceful-fs").promises;
const Path = require("path");
const FrontMatter = require("front-matter");
const Logger = require("logplease");
const logger = Logger.create("Markdown", Config.logplease);

function transform(source, target) {
  Filesystem.readFile(source, {
    encoding: "utf8",
    flag: "r",
  })
    .then(function (contents) {
      target = Path.join(Path.dirname(target), "data.json");
      const payload = JSON.stringify(FrontMatter(contents));
      Filesystem.writeFile(target, payload, function (error) {
        if (error) {
          logger.error(error);
          process.exit(0);
        }
      });
      logger.info(
        `Wrote ${target} in ${Util.msToTime(performance.now() - start)}`
      );
    })
    .catch(function (error) {
      if (error) {
        logger.error(error);
        process.exit(0);
      }
    });
  return true;
}

module.exports = transform;
