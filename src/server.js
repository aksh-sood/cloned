// import hapijs
import Hapi from "hapi";

const Path = require("path");
import routes from "./middleware/_api_data_listing";

const port = process.env.PORT || 8000;
console.log(__dirname);
const Inert = require("inert");
const Vision = require("vision");
const HapiSwagger = require("hapi-swagger");
const cors = require("hapi-modern-cors");
const init = async () => {
	const server = new Hapi.Server({
		port: port,
		routes: {
			cors: true,
			files: {
				relativeTo: Path.join(__dirname, "")
			}
		}
	});

	const swaggerOptions = {
		info: {
			title: "Branded Baba API Documentation"
		},
		grouping: "tags"
	};

	// register hapi swagger documentation
	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: swaggerOptions
		}
	]);

	await server.register({
		plugin: require("hapi-modern-cors"),
		options: { allowMethods: "GET,POST,PUT,DELETE" }
	});

	await server.route({
		method: "GET",
		path: "/hello",
		handler: (request, reply) => {
			return "Hello World!";
		}
	});

	await server.route({
		method: "GET",
		path: "/images_astro/{file*}",
		handler: {
			directory: {
				path: __dirname + "/images_astro"
			}
		}
	});

	server.route(routes);

	await server.start();
	console.log("Server running on %s", server.info.uri);
};

init();
