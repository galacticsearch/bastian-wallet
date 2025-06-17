# React + Vite

    > npm create vite@latest bastian-wallet -- --template react
    > cd bastian-wallet
    > npm install

### Instalación de libs necesarias

    > npm install @cosmjs/proto-signing buffer
    > npm install @esbuild-plugins/node-globals-polyfill --save-dev
    > npm install buffer
    > npm install rollup-plugin-node-polyfills --save-dev

 ### Agregá polyfills (muy importante para que funcione Buffer)

 👉 Modificá ``vite.config.js``:

    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
    import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

    export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        esbuildOptions: {
        plugins: [
            NodeGlobalsPolyfillPlugin({
            buffer: true
            })
        ]
        }
    },
    define: {
        global: 'globalThis'
    },
    resolve: {
        alias: {
        buffer: 'buffer',
        }
    },
    build: {
        rollupOptions: {
        plugins: [rollupNodePolyFill()]
        }
    }
    })

👉 Y ``en main.jsx``, agregá esto arriba de todo:

    import { Buffer } from 'buffer';
    window.Buffer = Buffer;

💡 Contenido de App.jsx (funcional)

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


### 🚀 Ejecutá la app

    > npm run dev




