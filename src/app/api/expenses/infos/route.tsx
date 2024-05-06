import { NextApiRequest } from "next";

import prisma from "@/prisma/prisma";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const year = req.nextUrl.searchParams.get("year");
  const month = req.nextUrl.searchParams.get("month");

  const expenses = await prisma.expense.findMany({
    where: {
      income: false,
      date: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`),
      },
    },
  });
  const income = await prisma.expense.findMany({
    where: {
      income: true,
      date: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`),
      },
    },
  });

  const result = {
    expenses: expenses.reduce((acc, cur) => acc + cur.amount, 0),
    income: income.reduce((acc, cur) => acc + cur.amount, 0),
  };
  return Response.json(result);
}
