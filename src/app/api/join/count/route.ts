import { NextResponse } from "next/server";

import { getCompletedRegistrationCount } from "@/lib/registrations";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ count: getCompletedRegistrationCount() });
}
