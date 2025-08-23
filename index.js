// Initialize Pi SDK
const scopes = ['username', 'payments'];
Pi.init({ version: "2.0", sandbox: false });

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("payBtn");
  if (btn) {
    btn.addEventListener("click", payWithPi);
  }
});

// Payment function
async function payWithPi() {
  try {
    const payment = await Pi.createPayment({
      amount: 1, // test payment: 1 Pi
      memo: "Test Transaction from Jobs & Freelance Hub",
      metadata: { type: "test" }
    }, {
      onReadyForServerApproval: function (paymentId) {
        console.log("✅ Ready for server approval:", paymentId);
        fetch("/approve-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: function (paymentId, txid) {
        console.log("✅ Ready for server completion:", paymentId, txid);
        fetch("/complete-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });
      },
      onCancel: function (paymentId) {
        console.log("❌ Payment cancelled:", paymentId);
      },
      onError: function (error, payment) {
        console.error("⚠️ Payment error:", error, payment);
      }
    });
  } catch (err) {
    console.error("⚠️ Error in payment:", err);
  }
}
