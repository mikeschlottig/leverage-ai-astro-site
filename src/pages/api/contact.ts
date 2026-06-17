// ============================================================
// CONTACT API — Leverage AI LLC
//   POST /api/contact
//   Receives JSON from the ContactForm React island, sends an
//   email via the Cloudflare Email Service `send_email` binding.
//
//   Binding access: Astro v6 + @astrojs/cloudflare v13 REMOVED
//   `Astro.locals.runtime.env` (it now throws). Bindings are read
//   via the `cloudflare:workers` module instead.
//   Ref: node_modules/@astrojs/cloudflare/dist/utils/handler.js
// ============================================================
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

interface EmailAddress {
  email: string;
  name?: string;
}

interface SendEmailMessage {
  to: string | EmailAddress | (string | EmailAddress)[];
  from: string | EmailAddress;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | EmailAddress;
}

interface SendEmailBinding {
  send(message: SendEmailMessage): Promise<{ messageId: string }>;
}

interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  message?: string;
}

const CONTACT_ADDRESS = 'contact@leverageai.network';

const json = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const POST: APIRoute = async ({ request }) => {
  // ContactForm posts JSON; tolerate form-encoded as a fallback.
  let payload: ContactPayload;
  const contentType = request.headers.get('content-type') ?? '';
  try {
    if (contentType.includes('application/json')) {
      payload = (await request.json()) as ContactPayload;
    } else {
      const form = await request.formData();
      payload = {
        name: form.get('name')?.toString(),
        email: form.get('email')?.toString(),
        company: form.get('company')?.toString(),
        service: form.get('service')?.toString(),
        message: form.get('message')?.toString(),
      };
    }
  } catch {
    return json({ success: false, error: 'Invalid request body.' }, 400);
  }

  const name = (payload.name ?? '').trim();
  const email = (payload.email ?? '').trim();
  const company = (payload.company ?? '').trim();
  const service = (payload.service ?? '').trim();
  const message = (payload.message ?? '').trim();

  if (!name || !email) {
    return json({ success: false, error: 'Name and email are required.' }, 400);
  }

  const emailBinding = (env as unknown as { EMAIL?: SendEmailBinding }).EMAIL;
  if (!emailBinding) {
    return json({ success: false, error: 'Email service is not configured.' }, 500);
  }

  try {
    await emailBinding.send({
      to: CONTACT_ADDRESS,
      from: CONTACT_ADDRESS, // must be on the verified leverageai.network domain
      replyTo: email,
      subject: `New Contact Form: ${name}`,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Company: ${company}\n` +
        `Service: ${service}\n\n` +
        `Message:\n${message}`,
      html:
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
        `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` +
        `<p><strong>Service:</strong> ${escapeHtml(service)}</p>` +
        `<hr/>` +
        `<p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
    });

    return json({ success: true }, 200);
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Unknown error';
    return json({ success: false, error: detail }, 500);
  }
};
