const scopes = ['username', 'payments'];
const pii = Pi.init({ version: "2.0", sandbox: false });

async function payPi() {
  try {
    const payment = await Pi.createPayment({
      amount: 1,   // test with 1 Pi
      memo: "Test Transaction",
      metadata: { type: "test" }
    }, {
      onReadyForServerApproval: function(paymentId) {
        console.log("Payment ready for server approval:", paymentId);
      },
      onReadyForServerCompletion: function(paymentId, txid) {
        console.log("Payment completed:", paymentId, txid);
      },
      onCancel: function(paymentId) {
        console.log("Payment cancelled:", paymentId);
      },
      onError: function(error, payment) {
        console.error(error, payment);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
