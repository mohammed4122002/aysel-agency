import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type ConsultationPayload = {
  department?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  budget?: string;
  details?: string;
};

export type SavedSubmission = {
  id: string;
  createdAt: string;
  status: string;
  department: string;
  fullName: string;
  email: string;
  phone: string;
  budget: string;
  details: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseLimit(value: string | null) {
  const parsed = Number(value ?? "");
  if (!Number.isFinite(parsed)) return 50;
  return Math.max(1, Math.min(200, Math.floor(parsed)));
}

function toSavedSubmission(row: {
  id: string;
  createdAt: Date;
  status: string;
  department: string;
  fullName: string;
  email: string;
  phone: string;
  budget: string;
  details: string;
}): SavedSubmission {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    status: row.status,
    department: row.department,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    budget: row.budget,
    details: row.details,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams.get("limit"));

    const rows = await prisma.consultationRequest.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ok: true,
      items: rows.map((row) => toSavedSubmission(row)),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر تحميل الطلبات.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConsultationPayload;

    const fullName = (body.fullName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || "").trim();
    const department = (body.department || "all").trim();
    const budget = (body.budget || "").trim();
    const details = (body.details || "").trim();

    if (fullName.length < 2) {
      return NextResponse.json({ ok: false, error: "الاسم مطلوب." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "البريد الإلكتروني غير صحيح." }, { status: 400 });
    }

    if (details.length > 500) {
      return NextResponse.json({ ok: false, error: "وصف المشروع يتجاوز الحد المسموح." }, { status: 400 });
    }

    const created = await prisma.consultationRequest.create({
      data: {
        status: "new",
        department,
        fullName,
        email,
        phone,
        budget,
        details,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر معالجة الطلب.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
