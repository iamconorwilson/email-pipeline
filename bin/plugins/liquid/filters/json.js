export default {
  json_escape: (str) => {
    return JSON.stringify(str).slice(1, -1);
  }
}