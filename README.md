# Email Pipeline
A comprehensive command line build tool for HTML email development using Nunjucks or Handlebars for templating, Sass for styling, and JSON for data.
* Create reusable components and modules using common web templating languages
* Build and automate email campaigns using data from JSON files
* Host files on a local development server with hot reloading for easier development
* Write your inline styles as Sass and have them applied automatically
* Create Outlook.com compatible dark mode from a standard dark mode media query
* Clean your emails, removing any unused code while protecting email specific HTML/CSS

## Usage
 1. Install the package to your project
``` npm i email-pipeline ```
 2. Create a `build.config.js` file in the root of your project and add the following code (for more configuration options, see the [docs](docs/config.md))
```js
const  options = () => {
  return {
    dir: {
      src:  "./src",
      dest:  "./dist"
    }
  }
};

```
3. Create a Nunjucks file in the 'src' directory containing your email code.
4. Run the command below in the root of your project
``` npx email-pipeline ```

## Folder Setup
The recommended folder structure is as below for a nunjucks project, but this can be customised to your needs.
```
src/
├── data/
├── sass/
├── templates/
└── email.njk
```
The build tool will render Nunjucks files at the root of your source folder, and Sass files at the root of the Sass folder. You can stop files from being rendered by prefixing the filename with an underscore (e.g. ``styles.scss`` will be rendered but ``_styles.scss`` will not).

## TODO
* Test email send function
* Additional templating language options (pug, tailwind, maizzle)
* Debugging option, skipping the HTML Clean stage to assist with bug fixing.