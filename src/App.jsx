import React, { useState } from 'react';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";

function App() {
  const [walletInfo, setWalletInfo] = useState(null);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("1000");
  const [mnemonicInput, setMnemonicInput] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [balance, setBalance] = useState(null);

  const rpcUrl = "http://localhost:26657";
  const apiUrl = "http://localhost:1317"; // REST API

  const fetchBalance = async (address) => {
    try {
      const res = await fetch(`${apiUrl}/cosmos/bank/v1beta1/balances/${address}`);
      const data = await res.json();
      setBalance(data.balances || []);
    } catch (err) {
      console.error("Error al obtener balance:", err);
    }
  };

  const handleWalletReady = async (wallet, mnemonic) => {
    const accounts = await wallet.getAccounts();
    const address = accounts[0].address;

    setWalletInfo({ wallet, address, mnemonic });
    setMnemonicInput("");
    await fetchBalance(address);
  };

  const generateWallet = async () => {
    const wallet = await DirectSecp256k1HdWallet.generate(12, { prefix: "cosmos" });
    await handleWalletReady(wallet, wallet.mnemonic);
  };

  const loadWalletFromMnemonic = async () => {
    try {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonicInput.trim(), {
        prefix: "cosmos",
      });
      await handleWalletReady(wallet, mnemonicInput.trim());
    } catch (err) {
      alert("Mnemonic inválido");
      console.error(err);
    }
  };

  const sendTokens = async () => {
    if (!walletInfo || !toAddress || !amount) {
      alert("Faltan datos para enviar");
      return;
    }

    try {
      const client = await SigningStargateClient.connectWithSigner(rpcUrl, walletInfo.wallet);

      const result = await client.sendTokens(
        walletInfo.address,
        toAddress,
        [{ denom: "stake", amount }],
        {
          amount: [{ denom: "stake", amount: "200" }],
          gas: "200000",
        }
      );

      alert(`Tokens enviados. Tx Hash: ${result.transactionHash}`);
      await fetchBalance(walletInfo.address);
    } catch (err) {
      console.error("Error enviando tokens:", err);
      alert("Error al enviar tokens");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Wallet Cosmos</h1>

      {!walletInfo && (
        <>
          <div style={{ marginBottom: 20 }}>
            <button onClick={generateWallet}>Generar Wallet Nueva</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <textarea
              placeholder="Pegá tu mnemonic existente"
              value={mnemonicInput}
              onChange={(e) => setMnemonicInput(e.target.value)}
              rows={3}
              cols={50}
            />
            <br />
            <button onClick={loadWalletFromMnemonic}>Cargar Wallet con Mnemonic</button>
          </div>
        </>
      )}

      {walletInfo && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Dirección:</strong> {walletInfo.address}</p>

          <p>
            <strong>Mnemonic:</strong>{" "}
            {showMnemonic ? walletInfo.mnemonic : "************"}{" "}
            <button onClick={() => setShowMnemonic(!showMnemonic)}>
              {showMnemonic ? "🙈 Ocultar" : "👁 Mostrar"}
            </button>
          </p>

          <h3>Balance</h3>
          {balance ? (
            balance.length === 0 ? (
              <p>Sin fondos</p>
            ) : (
              <ul>
                {balance.map((b) => (
                  <li key={b.denom}>{b.amount} {b.denom}</li>
                ))}
              </ul>
            )
          ) : (
            <p>Cargando balance...</p>
          )}

          <h2>Enviar Tokens</h2>
          <input
            type="text"
            placeholder="Dirección de destino"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            style={{ display: "block", marginBottom: 10, width: "400px" }}
          />
          <input
            type="text"
            placeholder="Cantidad (ej. 1000)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ display: "block", marginBottom: 10, width: "400px" }}
          />
          <button onClick={sendTokens}>Enviar</button>
        </div>
      )}
    </div>
  );
}

export default App;
