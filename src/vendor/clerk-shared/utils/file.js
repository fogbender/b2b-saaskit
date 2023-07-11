function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", function() {
      const result = JSON.parse(reader.result);
      resolve(result);
    });
    reader.addEventListener("error", reject);
    reader.readAsText(file);
  });
}
export {
  readJSONFile
};
//# sourceMappingURL=file.js.map