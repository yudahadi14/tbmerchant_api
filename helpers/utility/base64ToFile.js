var fs = require("fs");
var path = require("path");

const base64ToFile = (data, dir) => {
  let dataArr = data.split(",");
  let base64Content = dataArr[1];
  //   let base64Content = data.replace(
  //     /^data:image\/(png||jpg||jpeg||svg||heic);base64,/gi,
  //     ""
  //   );
  let mime = dataArr[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
  let fileType = mime.split("/")[1];
  const myPromise = new Promise((resolve, reject) => {
    return fs.writeFile(
      path.resolve(__dirname, "../../public" + dir + "." + fileType),
      base64Content,
      "base64",
      function (err) {
        if (err) {
          return reject(err);
        }
        return resolve("Berhasil Upload");
      }
    );
  });
  return myPromise;
};

module.exports = base64ToFile;
