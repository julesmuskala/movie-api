import app from "./app";

const start = async () => {
	const port = process.env.PORT || 5000;

	app.listen({ port }, () => {
		console.log(`🚀 App is up and running on port ${port}...`);
	});
};

export default start();
