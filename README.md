# COPE Static REST API

A static REST API based on the [Create Once, Publish Everywhere (COPE)](https://www.programmableweb.com/news/cope-create-once-publish-everywhere/2009/10/13) principle.

Content is written in Markdown and served as JSON, along with optimized media and a comprehensive index. Minimizes vendor lock-in, dependencies, and hosting requirements. Apt for hosting on GitHub or GitLab Pages, or any static service.

[Sample content](https://github.com/OleVik/grav-skeleton-scholar/tree/master/user/pages) from the [Scholar Theme](https://github.com/OleVik/grav-theme-scholar) for Grav.

## Installation and Requirements

Requires Node.js version 12 or later.

Run `npm install` to install dependencies.

## Usage

Fork the repository, edit Pages in `/content`, and run

```bash
npm run build
```

The `/docs`-folder is now populated with all your content and media.

### Customization

All settings are stored in `config.json`.

## License

MIT License 2020 by [Ole Vik](https://github.com/olevik).