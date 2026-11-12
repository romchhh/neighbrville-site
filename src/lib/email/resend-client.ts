import { Resend } from "resend";

import { resolveResendConfig } from "@/lib/admin/settings";

type ResendSendPayload = Omit<Parameters<Resend["emails"]["send"]>[0], "from"> & {
  from?: string;
};

export function createResendClient() {
  const { apiKey, from } = resolveResendConfig();
  if (!apiKey) {
    return { resend: null, from, apiKey: "" as const };
  }
  return { resend: new Resend(apiKey), from, apiKey };
}

function isTransientResendError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const name = "name" in error ? String(error.name) : "";
  const message = "message" in error ? String(error.message) : "";
  return (
    name === "application_error" ||
    /unable to fetch data|could not be resolved|network|timeout|econnreset|enotfound/i.test(
      message,
    )
  );
}

/** Send via Resend with one retry for flaky local/network DNS failures. */
export async function sendResendEmail(payload: ResendSendPayload) {
  const { resend, from } = createResendClient();
  if (!resend) {
    return { ok: false as const, reason: "missing_api_key" as const };
  }

  const body = {
    ...payload,
    from: payload.from || from,
  } as Parameters<Resend["emails"]["send"]>[0];

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const { error, data } = await resend.emails.send(body);
    if (!error) {
      return { ok: true as const, id: data?.id ?? null };
    }

    lastError = error;
    if (attempt < 2 && isTransientResendError(error)) {
      await new Promise((resolve) => setTimeout(resolve, 700 * attempt));
      continue;
    }
    break;
  }

  return {
    ok: false as const,
    reason: "send_failed" as const,
    error: lastError,
  };
}
