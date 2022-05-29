import { Router } from "express";

import { addMovie, getMovie } from "../controllers";

const router = Router();

router.route("/").post(addMovie).get(getMovie);

export default router;
