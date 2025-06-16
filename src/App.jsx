import React, { useState } from 'react';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

function App() {
  const [walletInfo, setWalletInfo] = useState(null);

  const generateWallet = async () => {
    const wallet = await DirectSecp256k1HdWallet.generate(12, {
      prefix: "cosmos",
    });
    const accounts = await wallet.getAccounts();
    setWalletInfo({
      address: accounts[0].address,
      mnemonic: wallet.mnemonic,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Generador de Wallet Cosmos</h1>
      <button onClick={generateWallet}>Generar Wallet</button>
      {walletInfo && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Dirección:</strong> {walletInfo.address}</p>
          <p><strong>Mnemonic:</strong> {walletInfo.mnemonic}</p>
        </div>
      )}
    </div>
  );
}

export default App;
