/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not set')
      return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const payload = await req.json().catch(() => ({}));
    const amount = payload.amount;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Assume `amount` is already provided in cents by the client.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "usd",
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('checkout POST error', err)
    const isDev = process.env.NODE_ENV !== 'production'
    const message = isDev ? (err?.message || String(err)) : 'Internal server error'
    const payload: any = { error: message }
    if (isDev && err?.stack) payload.stack = err.stack
    return NextResponse.json(payload, { status: 500 })
  }
}


