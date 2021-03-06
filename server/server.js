// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });

require("appmetrics-dash").attach();
require("appmetrics-prometheus").attach();
const appName = require("./../package").name;
const express = require("express");
const log4js = require("log4js");
const localConfig = require("./config/local.json");
const path = require("path");

const logger = log4js.getLogger(appName);
const app = express();
app.use(log4js.connectLogger(logger, { level: process.env.LOG_LEVEL || "info" }));
const passport = require("passport");
const serviceManager = require("./services/service-manager");
require("./services/index")(app);
require("./routers/index")(app);

// Add your code here

const port = process.env.PORT || localConfig.port;
app.listen(port, function(){
	logger.info(`insurancewebappbackend listening on http://localhost:${port}/appmetrics-dash`);
	logger.info(`OpenAPI (Swagger) spec is available at http://localhost:${port}/swagger/api`);
	logger.info(`Swagger UI is available at http://localhost:${port}/explorer`);

});

app.use("/home", passport.authenticate(serviceManager.get("appid-web-strategy-name")), (req, res) => {
	res.sendFile(path.join(__dirname, "../public", "home.html"));
});

// serve the files out of ./public as our main files
app.use(express.static("./public"));
