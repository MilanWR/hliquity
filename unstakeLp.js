const {
    Client,
    ContractExecuteTransaction,
    AccountId,
    PrivateKey,
    ContractFunctionParameters
} = require("@hashgraph/sdk");


async function main() {
    // Step 1: Replace with your Hedera account ID and private key
    const accountId = AccountId.fromString("0.0.---"); // Your account ID (payer)
    const privateKey = PrivateKey.fromString("---"); // Your private key

    // Step 2: Set up the Hedera client for Mainnet (Use Client.forTestnet() for Testnet)
    const client = Client.forMainnet();
    client.setOperator(accountId, privateKey);

    // Step 3: Call the function to unstake LP tokens
    await unstakeTokens(client, accountId);
}

async function unstakeTokens(client, accountId) {
    // Step 4: Define the contract ID and the amount to unstake
    const contractId = "0.0.6070133"; // Contract ID 
    const amount = 1234567890; // Amount of LP tokens to unstake --> make sure to check how many tokens you have, contract will faill if you try to withdraw more. This amount needs to be WITHOUT decimals! It has 8 decimals, so if you have 100 lp tokens, you need to put here 100 with 8 zeros (10000000000)

    // Step 5: Create a contract execute transaction to call the OwnerTransferV7b711143 function
    const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(contractId) // Set the contract ID
        .setGas(300000) // Set gas limit (adjust if necessary)
        .setFunction(
            "OwnerTransferV7b711143", // Name of the function in the contract
            new ContractFunctionParameters().addUint256(amount) // Add the amount as a uint256
        );

    // Step 6: Execute the transaction and get the receipt
    try {
        const response = await contractExecuteTx.execute(client);
        const receipt = await response.getReceipt(client);

        // Step 7: Check the transaction status
        if (receipt.status.toString() === "SUCCESS") {
            console.log("Successfully called OwnerTransferV7b711143 and unstaked LP tokens.");
        } else {
            console.error(`Unstake failed with status: ${receipt.status.toString()}`);
        }
    } catch (err) {
        console.error("Error executing the unstake transaction:", err.message);
    }
}

// Execute the main function
main();