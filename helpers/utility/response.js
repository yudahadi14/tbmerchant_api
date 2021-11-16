exports.success = (
  req,
  res,
  data = null,
  message = "Berhasil",
  status = 200
) => {
  return res.json({
    status: status,
    message: message,
    data: data,
  });
};

exports.error = (
  req,
  res,
  data = null,
  message = "Ada Kesalahan",
  status = 400
) => {
  return res.json({
    status: status,
    message: message,
    data: data,
  });
};
