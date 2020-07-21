# COPE Static REST API

A static REST API based on the [Create Once, Publish Everywhere (COPE)](https://www.programmableweb.com/news/cope-create-once-publish-everywhere/2009/10/13) principle.

Content is written in Markdown and served as JSON, along with optimized media and a comprehensive index. Minimizes vendor lock-in, dependencies, and hosting requirements. Apt for hosting on GitHub or GitLab Pages, or any static service.

[Sample content](https://github.com/OleVik/grav-skeleton-scholar/tree/master/user/pages) from the [Scholar Theme](https://github.com/OleVik/grav-theme-scholar) for Grav.

## Installation and Requirements

Requires Node.js version 12 or later.

Run `npm install` to install dependencies.

## Configuration

Edit `config.json` and set:

| Option | Description | Default | Type |
|-|-|-|-|
| Version | [SemVer](https://semver.org)-version of content. | Aligned with module. | String |
| baseDirectory | Relative path to content source. | "./content" | String |
| outputDirectory | Relative path to output-folder. | "./docs/api" | String |
| stores | Where to store transient and lasting files. | See below. | Object |
| stores.processed | Relative path to JSON-file with list of processed folders and files. | "./docs/api/processed.json" | String |
| stores.index | Relative path to JSON-file with index of folders and files. | "./docs/api/index.json" | String |
| stores.openapi | Relative path to JSON-file with generated OpenAPI spec. | "./docs/api/openapi.json" | String |
| stores.collections | Relative path to JSON-file with generated collections. | "./docs/api/collections.json" | String |
| transformers | Modules to apply to matched file-extensions. | See below. | Object |
| transformers[".md"] | Module to transform Markdown. | "./transformers/markdown.js" | String |
| transformers[".jpeg"] | Module to transform JPEG images. | "./transformers/image.js" | String |
| transformers[".jpg"] | Module to transform JPG images. | "./transformers/image.js" | String |
| transformers[".png"] | Module to transform PNG images. | "./transformers/image.js" | String |
| transformers[".gif"] | Module to transform GIF images. | "./transformers/image.js" | String |
| media | Properties to use for media-handling. | See below. | Object |
| media.maxSize | Max width or height of image. | 1920 | Integer |
| spec | Information about the API specification. | See below. | Object |
| spec.openapi | [OpenAPI](https://swagger.io/specification/)-version. | "3.*.*" | String |
| spec.info | Information about the API specification. | See below. | Object |
| spec.info.title | Title of the API. | "COPE Static API" | String |
| spec.info.description | Description of the API. | "..." | String |
| spec.info.version | Distinct [SemVer](https://semver.org)-version of this API. | "1.0.0" | String |
| spec.servers | List of API-endpoint base paths. | Array of objects, see [spec](https://swagger.io/specification/#server-object). | Array |
| logplease | Configuration for logger. | See below. | Object |
| logplease.showLevel | Display log level in the log message | true | Boolean |
| logplease.filename | Relative path to log-file. | "operations.log" | String |
| logplease.appendfile | Append logfile instead of overwriting | true | Boolean |

## Usage

Fork the repository, edit pages in `/content`, and run

```bash
npm run build
```

The `/docs`-folder is now populated with all your content and media, as well as documentation. Set your [repository's settings to publish to GitHub.io from /docs](https://docs.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) on the master-branch.

### Consuming

Your Content Management System, Static Site Generator, or other consumer of content can source all content from `/api/index.json`, which references itself, the OpenAPI-spec, as well as all content in the `content`-property.

## Development

### Transformers

A Transformer is any module which exports a default function that can be used to manipulate a file. The function most accept two parameters: First, the path to the source file, and second, the path to the output file. The module itself is responsible for reading and manipulating the file, as well as storing it in the given location.

This project is agnostic about how files are treated, and will in every instance pass the source- and target-paths to the module or script defined in `config.json`. By default this includes transforming Markdown-files with FrontMatter into JSON, as well as optimizing and resizing images.

## License

MIT License 2020 by [Ole Vik](https://github.com/olevik).