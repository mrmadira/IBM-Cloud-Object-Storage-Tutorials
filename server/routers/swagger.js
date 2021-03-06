var express = require("express");

module.exports = function(app){
	var router = express.Router();
	app.use("/swagger/api", express.static("./public/swagger.yaml"));
	app.use("/explorer", express.static("./public/swagger-ui"));
	app.use(router);
};
