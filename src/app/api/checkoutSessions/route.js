import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { origin } = new URL(req.headers.get('referer'));
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    price: 'price_1Po6vVGvHCfY6hWKjwcAM11H',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
        });

        return NextResponse.json({ clientSecret: session.client_secret });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('session_id');
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({
            status: session.status,
            customer_email: session.customer_details.email,
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
    }
}
