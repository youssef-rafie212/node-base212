import axios from "axios";
import crypto from "crypto";

// Paymob configuration
const PAYMOB_MODE = process.env.PAYMOB_STATUS || "test";
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_HMAC = process.env.PAYMOB_HMAC;
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const PAYMOB_INTEGRATION_ID_TEST = process.env.PAYMOB_INTEGRATION_ID_TEST;

const PAYMOB_SECRET_KEY =
    PAYMOB_MODE === "test"
        ? process.env.PAYMOB_SECRET_KEY_TEST
        : process.env.PAYMOB_SECRET_KEY_LIVE;

const PAYMOB_PUBLIC_KEY =
    PAYMOB_MODE === "test"
        ? process.env.PAYMOB_PUBLIC_KEY_TEST
        : process.env.PAYMOB_PUBLIC_KEY_LIVE;

// authenticate with paymob and get access token
export async function authenticate() {
    const response = await axios.post(`${PAYMOB_BASE_URL}/auth/tokens`, {
        api_key: PAYMOB_API_KEY,
    });
    return response.data.token;
}

// create a new order and get order id
export async function createOrder(authToken, amountCents, merchantOrderId) {
    const response = await axios.post(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
        auth_token: authToken,
        amount_cents: amountCents,
        currency: "SAR",
        items: [],
        merchant_order_id: merchantOrderId,
    });
    return response.data.id;
}

// generate a payment key using the order id
export async function generatePaymentKey(
    authToken,
    orderId,
    amountCents,
    billingData
) {
    const usedIntegrationId = PAYMOB_INTEGRATION_ID_TEST;

    const response = await axios.post(
        `${PAYMOB_BASE_URL}/acceptance/payment_keys`,
        {
            auth_token: authToken,
            amount_cents: amountCents,
            currency: "SAR",
            order_id: orderId,
            integration_id: usedIntegrationId,
            billing_data: billingData,
        }
    );
    return response.data.token;
}

// get iframe payment url using payment key and get payment web view
export function getPaymentUrl(paymentKey) {
    return `${PAYMOB_BASE_URL}/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
}

// create a unified checkout session and get payment web view
export async function createUnifiedCheckout(
    amountCents,
    billingData,
    specialReference
) {
    try {
        const response = await axios.post(
            `https://ksa.paymob.com/v1/intention/`,
            {
                amount: amountCents,
                currency: "SAR",
                payment_methods: [PAYMOB_INTEGRATION_ID_TEST],
                items: [
                    {
                        name: "Checkout",
                        amount: amountCents,
                        description: "Paymob Unified Checkout",
                        quantity: 1,
                    },
                ],
                billing_data: billingData,
                special_reference: specialReference,
            },
            {
                headers: {
                    Authorization: `Token ${PAYMOB_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const clientSecret = response.data.client_secret;
        return `https://ksa.paymob.com/unifiedcheckout/?publicKey=${PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;
    } catch (error) {
        console.error(
            "❌ Unified checkout creation failed:",
            error.response?.data || error.message
        );
        throw new Error("Failed to create unified checkout link.");
    }
}

// verify hmac signature for security
export function verifyHMAC(body, receivedHMAC) {
    const obj = body.obj;
    const hmacFields = [
        obj.amount_cents,
        obj.created_at,
        obj.currency,
        obj.error_occured,
        obj.has_parent_transaction,
        obj.id,
        obj.integration_id,
        obj.is_3d_secure,
        obj.is_auth,
        obj.is_capture,
        obj.is_refunded,
        obj.is_standalone_payment,
        obj.is_voided,
        obj.order.id,
        obj.owner,
        obj.pending,
        obj.source_data?.pan || "",
        obj.source_data?.sub_type || "",
        obj.source_data?.type || "",
        obj.success,
    ];

    const concatenated = hmacFields.map(String).join("");
    const computed = crypto
        .createHmac("sha512", PAYMOB_HMAC)
        .update(concatenated)
        .digest("hex");

    return computed === receivedHMAC;
}
