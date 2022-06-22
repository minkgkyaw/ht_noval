const onError = (err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error!",
  });
};

const onNoMatch = (req, res) => {
  return res.status(404).json({ message: "Not found" });
};

export { onError, onNoMatch };
