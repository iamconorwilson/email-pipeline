import path from "path";
import fs from "fs";

const getData = (dirPath) => {
    const files = fs.readdirSync(dirPath);
    const data = {};
    for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const filePath = path.resolve(dirPath, file);
        const fileData = fs.readFileSync(filePath, "utf8");
        //if file empty, skip
        if (!fileData) continue;

        const fileName = path.basename(file, ".json").replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        data[fileName] = JSON.parse(fileData);
    }
    return data;
};

const getFilepaths = (baseDir, type) => {
  if (!type) return;
  let dir = path.resolve(baseDir, type);

  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  const data = {};
  for (const file of files) {
      const filePath = path.relative(baseDir, path.resolve(dir, file));
      const fileName = path.basename(file, '.' + type).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      data[fileName] = filePath;
  }
  return data;
};

const getHelpers = (helpersDir) => {
  let helpers = {}
  fs.readdirSync(helpersDir, { encoding: "utf-8" })
      .forEach((filepath) => {
          let {name, fn} = require("../" + path.join(helpersDir, filepath))
          helpers[name] = fn
      })

  return helpers
}

const getPartials = (partialsDir) => {
  let partials = {}
  fs.readdirSync(partialsDir, { encoding: "utf-8" })
      .forEach((filepath) => {
          let partialSource = fs.readFileSync(path.join(partialsDir, filepath), {encoding:"utf-8"})
          let partialName = path.basename(filepath, ".hbs")
          partials[partialName] = partialSource
      })

  return partials
}



export { getData, getFilepaths, getPartials, getHelpers };
