
# 🧩 p10node Cosmos Chain Registry Snapshot Generator

A utility for generating parsed, schema-annotated snapshots of [Cosmos chain-registry](https://github.com/cosmos/chain-registry) data - including chains, assets, and IBC metadata - with both human-readable and minimized JSON formats.

## ✨ Features

- Fetches and saves the latest JSON Schemas from the official Cosmos chain-registry ()
- Parses and annotates:
  - **Chains** (`chain.json`)
  - **AssetLists** (`assetlist.json`)
  - **IBC Data** (`ibc_data.json`)
- Outputs data in both:
  - Beautified (pretty-printed) format
  - Minified (compact) format
- Generates useful mappings:
  - `chainId → chain`
  - `chainId → chainName`
  - `chainId → prettyName`
- Exports summary statistics for quick inspection

## 📦 Output Structure

All output is written to the `assets/` directory:

| File                                  | Description                                  |
|---------------------------------------|----------------------------------------------|
| `chains.json`                         | Full list of chain data (pretty)             |
| `chains.min.json`                     | Minified chain data                          |
| `assets.json`                         | Full asset lists (pretty)                    |
| `assets.min.json`                     | Minified asset lists                         |
| `ibc.json`                            | Full IBC data (pretty)                       |
| `ibc.min.json`                        | Minified IBC data                            |
| `chains.chainId.json`                 | Mapping: `chainId → Chain Fields`            |
| `chains.chainId.chainName.json`       | Mapping: `chainId → chainName`               |
| `chains.chainId.chainPrettyName.json` | Mapping: `chainId → prettyName`              |
| `stats.json`                          | Total counts and file sizes                  |
| `<schema>.schema.json`                | Raw schemas downloaded from `chain-registry` |

`<schema>`: `versions`, `memo_keys`, `chains`, `ibc_data`

## ☁️ Public Snapshots

All generated data files are publicly hosted at https://s3-files.p10node.onl/cosmos/chain-registry, examples:

```
https://s3-files.p10node.onl/cosmos/chain-registry/chains.json
https://s3-files.p10node.onl/cosmos/chain-registry/chains.min.json
...
```

These snapshots are **automatically updated every 30 minutes**. You can always download the latest versions directly from the URL above.

## 🛠️ Usage

```bash
sh run.sh
```

### Requirements

- [Bun](https://bun.com/) `v1.2`
- Network access to fetch schemas

## 🧠 Why?

The Cosmos [chain-registry](https://github.com/cosmos/chain-registry) is a canonical source of truth, but it's a monorepo with hundreds of nested directories. This tool simplifies consumption by generating single-file JSON dumps with consistent `$schema` annotations and convenient mapping structures.

Use cases include:

- Frontend apps (e.g. wallets, explorers)
- Backends (e.g. chain info APIs)
- Data analysis / visualization
- Static caching / CDN serving
- ...

## 📁 Example Output

```jsonc
// chains.chainId.json
{
  "zetachain_7000-1": {
    "$schema": "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/chain.schema.json",
    "chainName": "zetachain",
    "status": "live",
    "networkType": "mainnet",
    "prettyName": "ZetaChain",
    "chainType": "cosmos",
    "chainId": "zetachain_7000-1",
    "bech32Prefix": "zeta",
    "daemonName": "zetacored",
    "nodeHome": "$HOME/.zetacored",
    "keyAlgos": [
      "ethsecp256k1"
    ],
    "extraCodecs": [
      "ethermint"
    ],
    // ...
  },
  // ...
}

// chains.chainId.chainPrettyName.json
{
  "1": "Ethereum Mainnet",
  "30": "Rootstock",
  "namada.5f5de2dd1b88cba30586420": "Namada",
  "aaronetwork": "Aaron Network",
  "acre_9052-1": "Acrechain",
  "agoric-3": "Agoric",
  "aioz_168-1": "AIOZ Network",
  "akashnet-2": "Akash",
  "allora-mainnet-1": "Allora",
  "althea_258432-1": "Althea",
  "andromeda-1": "Andromeda",
  // ...
}
```

## 📄 License

MIT

## 🛰 Based on

- [`@chain-registry/types`](https://www.npmjs.com/package/@chain-registry/types)
- [`chain-registry`](https://github.com/cosmos/chain-registry)
