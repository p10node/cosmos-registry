import type { AssetList, Chain, IBCData } from "@chain-registry/types";
import { assetLists, chains, ibcData } from "chain-registry";
import fs from "node:fs";

const schemas: { [key: string]: string } = {
  chain: "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/chain.schema.json",
  assetlist: "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/assetlist.schema.json",
  ibc_data: "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/ibc_data.schema.json",
  memo_keys: "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/memo_keys.schema.json",
  versions: "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/versions.schema.json",
};

const fetchSchema = async (schema: string) => {
  const response = await fetch(schema);
  return response.json();
};

await Promise.all(
  Object.keys(schemas).map(async (schema) => {
    const url = schemas[schema];

    const data = await fetchSchema(url);
    fs.writeFileSync(`assets/${schema}.schema.json`, JSON.stringify(data, null, 2));
  }),
);

const parseChain = (chain: Chain): Chain => {
  return { ...chain, $schema: "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/chain.schema.json" };
};

const parseAsset = (asset: AssetList) => {
  return {
    ...asset,
    $schema: "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/assetlist.schema.json",
  };
};

const parseIBC = (ibc: IBCData) => {
  return {
    ...ibc,
    $schema: "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/ibc_data.schema.json",
  };
};

const parsedChains = chains.map((chain) => parseChain(chain));
const parsedAssets = assetLists.map((asset) => parseAsset(asset));
const parsedIBC = ibcData.map((ibc) => parseIBC(ibc));

const beauty = <T>(data: T) => JSON.stringify(data, null, 2);
const minimal = <T>(data: T) => JSON.stringify(data);

fs.writeFileSync("assets/chains.json", beauty(parsedChains));
fs.writeFileSync("assets/chains.min.json", minimal(parsedChains));

fs.writeFileSync("assets/assets.json", beauty(parsedAssets));
fs.writeFileSync("assets/assets.min.json", minimal(parsedAssets));

fs.writeFileSync("assets/ibc.json", beauty(parsedIBC));
fs.writeFileSync("assets/ibc.min.json", minimal(parsedIBC));

const stats = {
  chains: parsedChains.length,
  assets: parsedAssets.length,
  ibc: parsedIBC.length,
  fileLength: {
    chains: fs.statSync("assets/chains.json").size,
    chainsMin: fs.statSync("assets/chains.min.json").size,
    assets: fs.statSync("assets/assets.json").size,
    assetsMin: fs.statSync("assets/assets.min.json").size,
    ibc: fs.statSync("assets/ibc.json").size,
    ibcMin: fs.statSync("assets/ibc.min.json").size,
  },
};

fs.writeFileSync("assets/stats.json", beauty(stats));
fs.writeFileSync("assets/stats.min.json", minimal(stats));

const chainsByChainId = parsedChains.reduce<{ [chainId: string]: Chain }>((chainsByChainId, chain) => {
  if (chain.chainId) {
    chainsByChainId[chain.chainId] = chain;
  }

  return chainsByChainId;
}, {});

fs.writeFileSync("assets/chains.chainId.json", beauty(chainsByChainId));
fs.writeFileSync("assets/chains.chainId.min.json", minimal(chainsByChainId));

const chainIdChainName = parsedChains.reduce<{ [chainId: string]: string }>((chainIdChainName, chain) => {
  if (chain.chainId) {
    chainIdChainName[chain.chainId] = chain.chainName;
  }

  return chainIdChainName;
}, {});

fs.writeFileSync("assets/chains.chainId.chainName.json", beauty(chainIdChainName));
fs.writeFileSync("assets/chains.chainId.chainName.min.json", minimal(chainIdChainName));

const chainIdChainPrettyName = parsedChains.reduce<{ [chainId: string]: string }>((chainIdChainPrettyName, chain) => {
  if (chain.chainId) {
    chainIdChainPrettyName[chain.chainId] = chain.prettyName || chain.chainName;
  }

  return chainIdChainPrettyName;
}, {});

fs.writeFileSync("assets/chains.chainId.chainPrettyName.json", beauty(chainIdChainPrettyName));
fs.writeFileSync("assets/chains.chainId.chainPrettyName.min.json", minimal(chainIdChainPrettyName));
