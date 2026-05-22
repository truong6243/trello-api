const express = require("express");
const app = express();
const port = 3000;
const hostname = "localhost";
app.get("/", function (req, res) {
  res.send("<h1>Hello World  </h1>");
});

app.listen(port, hostname, () => {
  console.log(`server đang chạy ở http://${hostname}:${port}`);
});
