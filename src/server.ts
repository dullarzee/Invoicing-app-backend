import express, { type Request, type Response } from "express";
import clientsRoutes from "./routes/clientsRoutes";
import invoicesRoutes from "./routes/invoicesRoutes.js";
import { validateReqBody } from "./middle_wares/validate.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(validateReqBody);

//middleware for allowing access to static files like images, css etc. from the public folder
app.use("/images", express.static("public/images"));

app.get("/", (req: Request, res: Response) => {
  res.send(`Server is running. Try GET /api/clients`);
});

// clients routes
app.use("/api/clients", clientsRoutes);
// invoice routes
app.use("/api/invoices", invoicesRoutes);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
