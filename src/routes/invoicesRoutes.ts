import { Router } from "express";
import prisma from "../prismaInit";
import { type Request, type Response } from "express";

const router = Router();

// api/invoices/
router.get("/", async (_req: Request, res: Response) => {
  try {
    const response = await prisma.invoice.findMany({
      include: {
        client: true,
        lineItems: true,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error);
  }
});

// api/invoices/create
router.post("/create", async (req: Request, res: Response) => {
  if (!req.body)
    return res
      .json({ error: "Please include a body in your POST req" })
      .status(400);

  const { clientId, dueDate, note, lineItems } = req.body;
  if (!(clientId || dueDate || lineItems.length === 0))
    //check if any compulsory field is empty
    return res.status(400).json({
      error: "All fields mandatory for invoice creation must be provided",
    });

  console.log("req body: ", req.body);
  const invoice = await prisma.invoice.create({
    data: {
      clientId: clientId,
      dueDate: dueDate,
      NoteToClient: note,
      taxInPercent: req.body.taxInPercent || 0,
      status: req.body.status || "PENDING",
      lineItems: {
        create: lineItems.map(
          (item: { name: string; quantity: number; price: number }) => ({
            itemName: item.name,
            quantity: item.quantity,
            price: item.price,
          }),
        ),
      },
    },
  });
  return res
    .json({ message: "Invoice created successfully", invoice })
    .status(201);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  //check if id is provided in url params
  if (!id)
    return res
      .status(400)
      .json({ error: "Invoice id must be provided in the url params" });

  try {
    //first delete lineItems connected to invoice
    await prisma.lineItem.deleteMany({
      where: {
        invoiceId: id as string,
      },
    });
    //then delete the invoice
    await prisma.invoice.delete({
      where: {
        id: id as string,
      },
    });

    return res
      .json({ msg: "Invoice deleted successfully", ok: true })
      .status(200);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Invoice with the provided id not found", ok: false });
  }
});

export default router;
