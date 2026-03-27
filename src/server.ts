import express, { type Request, type Response } from "express";
import clientsRoutes from "./routes/clientsRoutes";
import invoicesRoutes from "./routes/invoicesRoutes";
import { validateReqBody } from "./middle_wares/validate";
import cors from "cors";

const PORT = 8001;

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(validateReqBody);

app.get("/", (req: Request, res: Response) => {
  res.send(`Server is running. Try GET /api/clients`);
});

// clients routes
app.use("/api/clients", clientsRoutes);
// invoice routes
app.use("/api/invoices", invoicesRoutes);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
