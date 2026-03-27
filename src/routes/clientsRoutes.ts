import { Router } from "express";
import prisma from "../prismaInit";
import { type Request, type Response } from "express";

const router = Router();

// api/clients/
router.get("/", async (req: Request, res: Response) => {
  const { includeInvoices } = req.query;
  try {
    const clients = await prisma.client.findMany({
      include: {
        invoices:
          includeInvoices === "true"
            ? {
                include: {
                  lineItems: true,
                },
              }
            : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json(clients); // return to avoid falling through
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching clients." });
  }
});

// api/clients/create
router.post("/create", async (req: Request, res: Response) => {
  const { companyName, email, phoneNumber, name } = req.body;
  if (!(companyName || email || phoneNumber || name))
    return res.status(400).json({
      error: "All fields mandatory for client creation must be provided",
    });
  try {
    const newClient = await prisma.client.create({
      data: {
        companyName: companyName,
        email: email,
        phoneNumber: phoneNumber,
        name: name,
      },
    });
    res
      .json({
        message: "added client successfully!",
        ok: true,
        data: newClient,
      })
      .status(301);
  } catch (error) {
    console.error("Error adding client: ", error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding client", ok: false });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json({ error: "Client id must be provided in the url params" });
  const { companyName, email, phoneNumber, name } = req.body;

  try {
    const updatedClient = await prisma.client.update({
      where: {
        id: id as string,
      },
      data: {
        companyName: companyName,
        email: email,
        phoneNumber: phoneNumber,
        name: name,
      },
    });
    res.json({
      message: "Client updated successfully!",
      ok: true,
      data: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client: ", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating client", ok: false });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json({ error: "Client id must be provided in the url params" });

  try {
    await prisma.client.delete({
      where: {
        id: id as string,
      },
    });
    res.json({ message: "Client deleted successfully!", ok: true });
  } catch (error) {
    console.error("Error deleting client: ", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting client", ok: false });
  }
});

export default router;
