import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import PaymentForm from "./PaymentForm"

const PUBLIC_KEY = "pk_test_51MliCCKyUx1Zcdy4mGSXPOWPJS4KUQRHmXoCeT268hxJOCkwQ0Awm4cePLpYn04qUZsjobzbH3bPlUP9mCqPowU800NfXah7MJ"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export default function StripeContainer() {
	return (
		<Elements stripe={stripeTestPromise}>
			<PaymentForm />
		</Elements>
	)
}