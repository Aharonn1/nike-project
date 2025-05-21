import routeNotFound from "./3-middleware/route-not-found";
import expressFileUpload from "express-fileupload";
import catchAll from "./3-middleware/catch-all";
import taskRoutes from "./6-routes/task-routes";
import authRoutes from "./6-routes/auth-routes";
import appConfig from "./2-utils/appConfig";
import express from "express";
import cors from "cors";

const server = express();

server.use(cors());
server.use(express.json());
server.use(expressFileUpload());
server.use("/api", authRoutes);
server.use("/api", taskRoutes);
server.use(routeNotFound);
server.use(catchAll);

server.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));