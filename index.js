<!DOCTYPE html>
<html lang="en">
<<script src="https://sdk.minepi.com/pi-sdk.js"></script>
>
  <meta charset="UTF-8">
  <title>Pi JobHub</title>
  <!-- Pi SDK -->
  <script src="https://sdk.minepi.com/pi-sdk.js"></script>
</head>
<<button id="payWithPiBtn">Pay with Pi</button>
<div id="result"></div>
>
  <h1>Welcome to Pi JobHub</h1>
  <p>A decentralized job marketplace powered by Pi Network.</p>

  <!-- Pay with Pi button -->
  <button id="payWithPiBtn">💰 Pay with Pi</button>
  <div id="result"></div>

  <script>
    // Initialize Pi SDK
    Pi.init({ version: "2.0", sandbox: true }); // use sandbox:true for testing

    // Handle button click
    document.getElementById("payWithPiBtn").addEventListener("click", async () => {
      try {
        const paymentData = {
          amount: 1, // test with 1 Pi
          memo: "Test Payment for Pi JobHub",
          metadata: { type: "job-listing" }
        };

        await Pi.createPayment(paymentData, {
          onReadyForServerApproval: (paymentId) => {
            console.log("Payment ID:", paymentId);
            document.getElementById("result").innerText = "Ready for approval: " + paymentId;
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            console.log("Transaction completed:", txid);
            document.getElementById("result").innerText = "Transaction completed: " + txid;
          },
          onCancel: () => {
            document.getElementById("result").innerText = "Payment cancelled.";
          },
          onError: (error) => {
            document.getElementById("result").innerText = "Error: " + error;
          }
        });

      } catch (err) {
        console.error(err);
        document.getElementById("result").innerText = "Payment failed: " + err.message;
      }
    });
  </script>
<<script>
  // Initialize Pi SDK with your App ID
  Pi.init({ version: "2.0", sandbox: false }); // change sandbox:true for testing

  document.getElementById("payWithPiBtn").addEventListener("click", async () => {
    try {
      const paymentData = {
        amount: 1, // test with 1 Pi
        memo: "Test Payment for Pi JobHub",
        metadata: { type: "job-listing" }
      };

      await Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId) => {
          console.log("Payment ID:", paymentId);
          document.getElementById("result").innerText = "Payment ready for approval: " + paymentId;
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("Transaction completed:", txid);
          document.getElementById("result").innerText = "Transaction completed: " + txid;
        },
        onCancel: () => {
          document.getElementById("result").innerText = "Payment cancelled.";
        },
        onError: (error) => {
          document.getElementById("result").innerText = "Error: " + error;
        }
      });

    } catch (err) {
      console.error(err);
      document.getElementById("result").innerText = "Payment failed: " + err.message;
    }
  });
</script>
>
</html>
