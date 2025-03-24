"use client"

import React, { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function App() {
    // Fetch the client secret from the server to initialize the checkout session
    const fetchClientSecret = useCallback(async () => {
        try {
            const response = await fetch("/api/checkoutSessions", {
                method: "POST",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch client secret');
            }

            return data.clientSecret;
        } catch (error) {
            console.error('Error fetching client secret:', error);
            return null; // or handle the error as needed
        }
    }, []);

    // Options for EmbeddedCheckoutProvider, including the function to fetch the client secret
    const options = { fetchClientSecret };

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout className="max-h-[80dvh]" />
            </EmbeddedCheckoutProvider>
        </div>
    );
}
