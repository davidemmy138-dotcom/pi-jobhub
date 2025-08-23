// script.js
let Pi = null;
const PAYMENT_AMOUNT = 1.0;
const PAYMENT_MEMO = "Test payment";

document.getElementById("status").textContent = "Loading Pi SDK...";

// Initialize Pi SDK
if (typeof window.Pi !== 'undefined') {
  Pi = window.Pi;
  document.getElementById("payButton").disabled = false;
  document.getElementById("payButton").textContent = "Pay with Pi";
  document.getElementById("status").textContent = "SDK loaded. Ready to pay.";
} else {
  document.getElementById("status").textContent = "Pi SDK not available. Open in Pi Browser!";
}

// Create Payment
document.getElementById("payButton").onclick = async () => {
  const paymentData = {
    amount: PAYMENT_AMOUNT,
    memo: PAYMENT_MEMO,
    metadata: { productId: "test-001" }
  };

  const callbacks = {
    onReadyForServerApproval: async (paymentId) => {
      document.getElementById("status").textContent = `Approving payment... (${paymentId})`;
      const response = await fetch("/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId })
      });
      const data = await response.json();
      if (response.ok) {
        document.getElementById("status").textContent = "✅ Approved! Completing...";
      } else {
        document.getElementById("status").textContent = "❌ Approval failed";
        console.error(data);
      }
    },

    onReadyForServerCompletion: async (paymentId, txid) => {
      document.getElementById("status").textContent = `Completing transaction... (${txid})`;
      const response = await fetch("/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, txid })
      });
      const data = await response.json();
      if (response.ok) {
        document.getElementById("status").textContent = "🎉 Payment completed!";
      } else {
        document.getElementById("status").textContent = "❌ Completion failed";
        console.error(data);
      }
    },

    onCancel: (paymentId) => {
      document.getElementById("status").textContent = "❌ Payment canceled by user.";
    },

    onError: (error, paymentId) => {
      document.getElementById("status").textContent = "💥 Error: " + error.code;
      console.error("Payment error:", error);
    }
  };

  try {
    await Pi.createPayment(paymentData, callbacks);
  } catch (error) {
    document.getElementById("status").textContent = "🚫 SDK Error";
    console.error("Create payment failed:", error);
  }
};
