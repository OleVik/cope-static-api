const Config = require("../config.json");
const Util = require("./utilities");
const { performance } = require("perf_hooks");
const start = performance.now();
const Filesystem = require("graceful-fs");
const Path = require("path");
const { isBinaryFileSync } = require("isbinaryfile");
const mime = require("mime");
const Logger = require("logplease");
const logger = Logger.create("OpenAPI", Config.logplease);

function operation(path, summary = "", description = "") {
  return {
    get: {
      summary: summary,
      description: description,
      responses: response(
        mime.getType(path),
        "string",
        isBinaryFileSync(Path.resolve(process.cwd(), path))
      ),
    },
  };
}

function response(mimeType, type = "string", binary = false) {
  const schema = {
    type: type,
  };
  if (binary) {
    schema.format = "binary";
  }
  return {
    "200": {
      description: "OK",
      content: {
        [mimeType]: {
          schema: schema,
        },
      },
    },
  };
}

if (!Filesystem.existsSync(Path.resolve(process.cwd(), Config.stores.index))) {
  logger.error(`${Config.stores.processed} does not exist`);
  process.exit(1);
}

const data = JSON.parse(
  Filesystem.readFileSync(Path.resolve(process.cwd(), Config.stores.index), {
    encoding: "utf8",
    flag: "r",
  })
);
if (data.length < 1) {
  logger.error(`No Index to iterate`);
  process.exit(1);
}

let Spec = Config.spec;
Spec.paths = {};
data.content.forEach((item) => {
  Spec.paths[`/${item}`] = operation(`${Config.outputDirectory}/${item}`, item);
});

Filesystem.writeFile(Config.stores.openapi, JSON.stringify(Spec), function (
  error
) {
  if (error) {
    throw error;
  }
  logger.info(
    `Wrote ${data.content.length} items to ${
      Config.stores.openapi
    } in ${Util.msToTime(performance.now() - start)}`
  );
});
