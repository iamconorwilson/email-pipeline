export default {
  'url_escape': (str) => {
    return encodeURI(str);
  },
  'url_param_escape': (str) => {
    return encodeURIComponent(str);
  }
}