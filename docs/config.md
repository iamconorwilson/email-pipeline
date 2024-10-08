# Configuration

You can create an `build.config.js` file in order to set custom options for your project. Here is the most basic version of this file. Additional options can be added to further customise your project.

```js
const options = () => {
  //return your options
  return {
    dir: {
      src: "./src",
      dest: "./dist",
    },
  };
};

export default options;
```

## Configuration Options

### Directory Structure

#### Source Directory

Controls the top level directory/glob that we’ll use to look for emails to be rendered.

|                 |                      |
| --------------- | -------------------- |
| _Object Key_    | `dir.src`            |
| _Default Value_ | `./src`              |
| _Valid Options_ | Any valid directory. |

#### Example

```js
const options = () => {
  return {
    dir: {
      src: "./src",
    },
  };
};
```

#### Destination Directory

Sets the top level directory that emails and css will be rendered to. This will be created if it doesn't exist

|                 |                      |
| --------------- | -------------------- |
| _Object Key_    | `dir.dest`           |
| _Default Value_ | `./dist`            |
| _Valid Options_ | Any valid directory. |

#### Example

```js
const options = () => {
  return {
    dir: {
      dest: "./dist",
    },
  };
};
```

#### Data Directory (optional)

Sets the directory for looking up data.json files

|                 |                      |
| --------------- | -------------------- |
| _Object Key_    | `dir.data`           |
| _Default Value_ | `./src/data`         |
| _Valid Options_ | Any valid directory. |

#### Example

```js
const options = () => {
  return {
    dir: {
      data: "./src/data",
    },
  };
};
```

### Passthrough (optional)

An array of source and destinations for passing through files without any modification. Useful for client override CSS or images/assets passed through from the source folder.

|                 |                                                                |
| --------------- | -------------------------------------------------------------- |
| _Object Key_    | `passthrough`                                                  |
| _Default Value_ | `[]`                                                           |
| _Valid Options_ | An array of objects containing a src glob and a dest directory |

#### Example

```js
const options = () => {
  return {
    passthrough: [{ src: "./src/passthrough/*", dest: "./build/passthrough" }],
  };
};
```

### HTML Renderer

Set the HTML renderer to be used. Options are `nunjucks` or `handlebars`. Defaults to `nunjucks`.

|                 |                            |
| --------------- | -------------------------- |
| _Object Key_    | `htmlRenderer`             |
| _Default Value_ | `nunjucks`                 |
| _Valid Options_ | `nunjucks` or `handlebars` |

#### Example

```js
const options = () => {
  return {
    htmlRenderer: "nunjucks",
  };
};
```

### Nunjucks - Custom Templates (optional)

Array of additional template directories to be accessed by nunjucks. Set in addition to the default `./src/templates` directory.

|                 |                            |
| --------------- | -------------------------- |
| _Object Key_    | `nunjucks.customTemplates` |
| _Default Value_ | `[]`                       |
| _Valid Options_ | Array of valid directories |

#### Example

```js
const options = () => {
  return {
    nunjucks: {
      customTemplates: ["./src/templates/"],
    },
  };
};
```

### Nunjucks - Custom Filters (optional)

Array of custom filter options passed to the nunjucks render function. See [nunjucks custom filter](https://mozilla.github.io/nunjucks/api.html#custom-filters) documentation.

|                 |                                                                  |
| --------------- | ---------------------------------------------------------------- |
| _Object Key_    | `nunjucks.customFilters`                                         |
| _Default Value_ | `[]`                                                             |
| _Valid Options_ | An array containing functions as per the nunjucks documentation. |

#### Example

```js
const options = () => {
  return {
    nunjucks: {
      customFilters: [{
		name: "filter-name",
		func: function()
	  }]
    }
  }
};
```

### Nunjucks - Custom Extensions (optional)

Array of custom extensions passed to the nunjucks render function. See [nunjucks custom tags](https://mozilla.github.io/nunjucks/api.html#custom-tags) documentation.

|                 |                                                                  |
| --------------- | ---------------------------------------------------------------- |
| _Object Key_    | `nunjucks.customExtensions`                                      |
| _Default Value_ | `[]`                                                             |
| _Valid Options_ | An array containing functions as per the nunjucks documentation. |

#### Example

```js
const options = () => {
  return {
    nunjucks: {
      customExtensions: [{
        name: "ext-name",
        func: function()
	  }]
    }
  }
};
```

### Nunjucks - Custom Globals (optional)

Array of global variables passed to the nunjucks render function. See [nunjucks custom globals](https://mozilla.github.io/nunjucks/api.html#addglobal) documentation.

|                 |                          |
| --------------- | ------------------------ |
| _Object Key_    | `nunjucks.customGlobals` |
| _Default Value_ | `[]`                     |
| _Valid Options_ | Array of key value pairs |

#### Example

```js
const options = () => {
  return {
    nunjucks: {
      customGlobals: [
        { globalName: "globalValue" },
        // ...add more as needed
      ],
    },
  };
};
```

### Handlebars - Custom Partials (optional)

Array of additional partial directories to be accessed by handlebars. Set in addition to the default `./src/partials` directory.

|                 |                             |
| --------------- | --------------------------- |
| _Object Key_    | `handlebars.customPartials` |
| _Default Value_ | `[]`                        |
| _Valid Options_ | Array of valid directories  |

#### Example

```js
const options = () => {
  return {
    handlebars: {
      customPartials: ["./src/partials/"],
    },
  };
};
```

### Handlebars - Custom Helpers (optional)

Array of additional helper directories to be accessed by handlebars. Set in addition to the default `./src/herlpers` directory.

|                 |                            |
| --------------- | -------------------------- |
| _Object Key_    | `handlebars.customHelpers` |
| _Default Value_ | `[]`                       |
| _Valid Options_ | Array of valid directories |

#### Example

```js
const options = () => {
  return {
    handlebars: {
      customHelpers: ["./src/helpers/"],
    },
  };
};
```

### Sass - Custom Options (optional)

Custom options passed to the sass render function. See [sass options](https://sass-lang.com/documentation/js-api/interfaces/Options) documentation.

|                 |                                                             |
| --------------- | ----------------------------------------------------------- |
| _Object Key_    | `sass.customOpts`                                           |
| _Default Value_ | `{}`                                                        |
| _Valid Options_ | An object containing options as per the sass documentation. |

#### Example

```js
const options = () => {
  return {
    sass: {
      customOpts: {
        //sass options
      },
    },
  };
};
```

### PostCSS - Custom Plugins (optional)

Custom plugins passed to the PostCSS function. These will be added to the default plugin set ([autoprefixer](https://github.com/postcss/autoprefixer), [sortMediaQueries](https://github.com/yunusga/postcss-sort-media-queries), emailDarkmode)

|                 |                                         |
| --------------- | --------------------------------------- |
| _Object Key_    | `postcss`                               |
| _Default Value_ | `[]`                                    |
| _Valid Options_ | An array of functions passed to PostCSS |

#### Example

```js
const options = () => {
  return {
    postCss: [
      //plugin functions
    ],
  };
};
```

### CleanHTML - Custom Options (optional)

An object of options passed directly to the emailcomb function. See [emailcomb](https://codsen.com/os/email-comb#api-comb) documentation.

|                 |                                       |
| --------------- | ------------------------------------- |
| _Object Key_    | `cleanHtml.customOpts`                |
| _Default Value_ | _see below_                           |
| _Valid Options_ | Options object for emailcomb function |

#### Example

```js
const options = () => {
  return {
    cleanHtml: {
      customOpts: {
        whitelist: [
          ".External*",
          ".ReadMsgBody",
          ".yshortcuts",
          ".Mso*",
          "#outlook",
          ".module*",
          ".video*",
          ".Singleton",
          "#MessageViewBody",
        ],
        removeHTMLComments: false,
        uglify: false,
        htmlCrushOpts: { removeIndentations: false, removeLineBreaks: false },
      },
    },
  };
};
```

### Server - Port (optional)

Port number for the development server. Defaults to `3030`. If the port is unavailable, we increment the port until a free one is found.

|                 |                          |
| --------------- | ------------------------ |
| _Object Key_    | `server.port`            |
| _Default Value_ | `3030`                   |
| _Valid Options_ | An available port number |

#### Example

```js
const options = () => {
  return {
    server: {
      port: 3030,
    },
  };
};
```

### Server - QR Code (optional)

Show a QR code in the terminal for the external IP. This makes it easier to connect and preview on a mobile device.

|                 |                 |
| --------------- | --------------- |
| _Object Key_    | `server.qrCode` |
| _Default Value_ | `true`          |
| _Valid Options_ | Boolean         |

#### Example

```js
const options = () => {
  return {
    server: {
      qrCode: true,
    },
  };
};
```

### Server - Open in Browser (optional)

Open the browser automatically when the server starts.

|                 |                      |
| --------------- | -------------------- |
| _Object Key_    | `server.openBrowser` |
| _Default Value_ | `false`              |
| _Valid Options_ | Boolean              |

#### Example

```js
const options = () => {
  return {
    server: {
      openBrowser: false,
    },
  };
};
```

### Server - Middleware (optional)

An array of middleware functions passed to the Express server. See [Express](https://expressjs.com/en/guide/using-middleware.html) documentation.

|                 |                                     |
| --------------- | ----------------------------------- |
| _Object Key_    | `server.middleware`                 |
| _Default Value_ | `[]`                                |
| _Valid Options_ | Array of valid middleware functions |

#### Example

```js
const options = () => {
  return {
    server: {
      middleware: [
        //functions
      ],
    },
  };
};
```
