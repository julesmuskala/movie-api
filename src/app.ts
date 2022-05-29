import express from "express";
import cors from "cors";

import routes from "./routes";
import notFound from "./middleware/not-found";
import errorHandler from "./middleware/error-handler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v0/movies", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
