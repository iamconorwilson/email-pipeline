
import encoding from "./filters/encoding.js";
import json from "./filters/json.js";
import number from "./filters/number.js";
import property from "./filters/property.js";
import url from "./filters/url.js";

import connectedContent from "./tags/connectedContent.js";

const filters = {
  ...encoding,
  ...json,
  ...number,
  ...property,
  ...url
}

const tags = {
  'connected_content': connectedContent
}

export { filters, tags };