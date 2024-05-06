import prisma from "@/prisma/prisma";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const year = req.nextUrl.searchParams.get("year");
  const month = req.nextUrl.searchParams.get("month");

  const result = await prisma.expense.findMany({
    where: {
      date: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`),
      },
    },
  });

  return Response.json(result);
}

export async function POST(req: Request) {
  const res = await req.json();
  const { date, title, category, amount, income } = res;

  const resultPost = await prisma.expense.create({
    data: {
      date,
      title,
      category,
      amount,
      income,
    },
  });

  revalidateTag("expenses");

  return Response.json(resultPost);
}

export async function PUT(req: Request) {
  const res = await req.json();
  const { id, date, title, category, amount, income } = res;
  const resultPost = await prisma.expense.update({
    where: {
      id,
    },
    data: {
      date,
      title,
      category,
      amount,
      income,
    },
  });
  return Response.json(resultPost);
}

export async function DELETE(req: Request) {
  const res = await req.json();
  const { id } = res;
  const resultPost = await prisma.expense.delete({
    where: {
      id,
    },
  });
  return Response.json(resultPost);
}
