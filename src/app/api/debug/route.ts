import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY || null;
    const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || null;

    const maskedStripe = stripeKey ? `${stripeKey.slice(0, 4)}... (masked)` : null;

    return NextResponse.json({
      stripeConfigured: !!stripeKey,
      publicKeyConfigured: !!publicKey,
      maskedStripe,
      nodeVersion: typeof process !== 'undefined' ? process.version : null,
    });
  } catch (err) {
    console.error('debug route error', err);
    return NextResponse.json({ error: 'failed to read env' }, { status: 500 });
  }
}
