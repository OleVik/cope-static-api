const Config = require("../../config.json");
const Util = require("../utilities");
const { performance } = require("perf_hooks");
const start = performance.now();
const Filesystem = require("graceful-fs");
const Path = require("path");
const Jimp = require("jimp");
const Logger = require("logplease");
const logger = Logger.create("Image", Config.logplease);

function transform(source, target) {
  const image = Path.resolve(source);
  const filename = Path.basename(image);
  const resize = { width: Jimp.AUTO, height: Jimp.AUTO };
  Jimp.read(image, (error, instance) => {
    if (error) {
      logger.error(error);
      process.exit(0);
    }
    const sourceSize = {
      length: instance.bitmap.data.length,
      width: instance.bitmap.width,
      height: instance.bitmap.height,
    };
    if (
      instance.bitmap.width < Config.media.maxSize ||
      instance.bitmap.height < Config.media.maxSize
    ) {
      Filesystem.copyFile(image, target, (error) => {
        if (error) {
          logger.error(error);
          process.exit(0);
        }
        logger.info(`Copied ${filename} (without resizing) to ${target}`);
      });
      return false;
    }
    if (instance.bitmap.width < instance.bitmap.height) {
      resize.height = Config.media.maxSize;
    } else {
      resize.width = Config.media.maxSize;
    }
    instance.resize(resize.width, resize.height).write(target);
    const targetSize = {
      length: instance.bitmap.data.length,
      width: instance.bitmap.width,
      height: instance.bitmap.height,
    };
    const sizeDifference = Math.round(
      ((sourceSize.length - targetSize.length) / sourceSize.length) * 100
    );
    logger.info(
      `Copied ${filename} (resized from ${sourceSize.width}x${
        sourceSize.height
      } to ${targetSize.width}x${
        targetSize.height
      }, ${sizeDifference} % reduction) to ${target} in ${Util.msToTime(
        performance.now() - start
      )}`
    );
  });
  return true;
}

module.exports = transform;
