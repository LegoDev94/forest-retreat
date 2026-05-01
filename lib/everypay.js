// EveryPay API wrapper. Server-only. All requests use HTTP Basic auth.
// Toggle demo / prod via EVERYPAY_MODE env var.

const DEMO_BASE = 'https://igw-demo.every-pay.com/api/v4';
const PROD_BASE = 'https://pay.every-pay.eu/api/v4';

function baseUrl() {
  const mode = (process.env.EVERYPAY_MODE || 'demo').toLowerCase();
  return mode === 'production' ? PROD_BASE : DEMO_BASE;
}

function authHeader() {
  const u = process.env.EVERYPAY_API_USERNAME;
  const s = process.env.EVERYPAY_API_SECRET;
  if (!u || !s) throw new Error('EveryPay env vars missing: EVERYPAY_API_USERNAME / EVERYPAY_API_SECRET');
  const token = Buffer.from(`${u}:${s}`, 'utf8').toString('base64');
  return `Basic ${token}`;
}

export function isEverypayConfigured() {
  return Boolean(process.env.EVERYPAY_API_USERNAME && process.env.EVERYPAY_API_SECRET);
}

export function isEverypayDemoMode() {
  return (process.env.EVERYPAY_MODE || 'demo').toLowerCase() !== 'production';
}

function nonce() {
  // 32 hex chars — random enough for replay protection
  return Array.from({ length: 4 }, () => Math.random().toString(16).slice(2)).join('').slice(0, 32);
}

function isoNow() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

// Initiate a one-off payment. Returns { payment_reference, payment_link, payment_state, raw }.
export async function createOneoffPayment({
  amount,                 // number (decimal, EUR)
  orderReference,         // unique within the merchant
  customerUrl,            // where to redirect after payment
  email,
  customerIp,             // optional but recommended for fraud rules
  locale = 'en',
  description,
}) {
  if (!isEverypayConfigured()) throw new Error('EveryPay not configured');
  const accountName = process.env.EVERYPAY_ACCOUNT_NAME || 'EUR3D1';
  const apiUsername = process.env.EVERYPAY_API_USERNAME;

  const body = {
    api_username:    apiUsername,
    account_name:    accountName,
    amount:          Number(amount.toFixed(2)),
    order_reference: orderReference,
    customer_url:    customerUrl,
    nonce:           nonce(),
    timestamp:       isoNow(),
    locale,
    request_token:   false,
  };
  if (email)       body.email = email;
  if (customerIp)  body.customer_ip = customerIp;
  if (description) body.payment_description = description;

  const res = await fetch(`${baseUrl()}/payments/oneoff`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': authHeader(),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || `HTTP ${res.status}`;
    throw new Error(`EveryPay create payment failed: ${msg}`);
  }
  return {
    payment_reference: json.payment_reference,
    payment_link:      json.payment_link,
    payment_state:     json.payment_state,
    raw:               json,
  };
}

// GET status of an existing payment.
export async function getPaymentStatus(paymentReference) {
  if (!isEverypayConfigured()) throw new Error('EveryPay not configured');
  const apiUsername = process.env.EVERYPAY_API_USERNAME;
  const url = `${baseUrl()}/payments/${encodeURIComponent(paymentReference)}?api_username=${encodeURIComponent(apiUsername)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Authorization': authHeader() },
    cache: 'no-store',
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message || `HTTP ${res.status}`;
    throw new Error(`EveryPay get payment failed: ${msg}`);
  }
  return json;
}

// Map EveryPay state strings to our payment_state enum
export function mapEverypayState(s) {
  switch ((s || '').toLowerCase()) {
    case 'initial':
    case 'waiting_for_3ds':
    case 'waiting_for_sca':
    case 'sent_for_processing':
      return 'pending';
    case 'settled':
    case 'authorized':
      return 'paid';
    case 'voided':
      return 'voided';
    case 'refunded':
      return 'refunded';
    case 'failed':
      return 'failed';
    case 'abandoned':
      return 'abandoned';
    default:
      return 'pending';
  }
}
