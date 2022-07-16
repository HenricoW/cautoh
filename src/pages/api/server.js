var https = require("https");
const { parse } = require("url");
var fs = require("fs");
require("dotenv").config();

const next = require("next");
const port = parseInt(process.env.PORT, 10) || 3000; // config.getPort();
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname: "localhost", port });
const handle = app.getRequestHandler();

var options = {
  key: fs.readFileSync(process.env.KEY),
  cert: fs.readFileSync(process.env.CERT),
};

app.prepare().then(() => {
  https
    .createServer(options, async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("internal server error");
      }
    })
    .listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port}`);
    });
});
