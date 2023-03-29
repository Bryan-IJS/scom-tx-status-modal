import { Wallet } from '@ijstech/eth-wallet';
import { INetwork } from './interface';
export { INetwork };

const networks: INetwork[] = [
  {
    name: "Ethereum",
    chainId: 1,
    img: "eth",
    rpc: "https://mainnet.infura.io/v3/{InfuraId}",
    symbol: "ETH",
    env: "mainnet",
    explorerName: "Etherscan",
    explorerTxUrl: "https://etherscan.io/tx/",
    explorerAddressUrl: "https://etherscan.io/address/"
  },
  {
    name: "Kovan Test Network",
    chainId: 42,
    img: "eth",
    rpc: "https://kovan.infura.io/v3/{InfuraId}",
    symbol: "ETH",
    env: "testnet",
    explorerName: "Etherscan",
    explorerTxUrl: "https://kovan.etherscan.io/tx/",
    explorerAddressUrl: "https://kovan.etherscan.io/address/"
  },
  {
    name: "Binance Smart Chain",
    chainId: 56,
    img: "bsc",
    rpc: "https://bsc-dataseed.binance.org/",
    symbol: "BNB",
    env: "mainnet",
    explorerName: "BSCScan",
    explorerTxUrl: "https://bscscan.com/tx/",
    explorerAddressUrl: "https://bscscan.com/address/"
  },
  {
    name: "Polygon",
    chainId: 137,
    img: "polygon",
    symbol: "MATIC",
    env: "mainnet",
    explorerName: "PolygonScan",
    explorerTxUrl: "https://polygonscan.com/tx/",
    explorerAddressUrl: "https://polygonscan.com/address/"
  },
  {
    name: "Fantom Opera",
    chainId: 250,
    img: "ftm",
    rpc: "https://rpc.ftm.tools/",
    symbol: "FTM",
    env: "mainnet",
    explorerName: "FTMScan",
    explorerTxUrl: "https://ftmscan.com/tx/",
    explorerAddressUrl: "https://ftmscan.com/address/"
  },
  {
    name: "BSC Testnet",
    chainId: 97,
    img: "bsc",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    symbol: "BNB",
    env: "testnet",
    explorerName: "BSCScan",
    explorerTxUrl: "https://testnet.bscscan.com/tx/",
    explorerAddressUrl: "https://testnet.bscscan.com/address/"
  },
  {
    name: "Amino Testnet",
    chainId: 31337,
    img: "amio",
    symbol: "ACT",
    env: "testnet"
  },
  {
    name: "Avalanche FUJI C-Chain",
    chainId: 43113,
    img: "avax",
    rpc: "https://api.avax-test.network/ext/bc/C/rpc",
    symbol: "AVAX",
    env: "testnet",
    explorerName: "SnowTrace",
    explorerTxUrl: "https://testnet.snowtrace.io/tx/",
    explorerAddressUrl: "https://testnet.snowtrace.io/address/"
  },
  {
    name: "Mumbai",
    chainId: 80001,
    img: "polygon",
    rpc: "https://matic-mumbai.chainstacklabs.com",
    symbol: "MATIC",
    env: "testnet",
    explorerName: "PolygonScan",
    explorerTxUrl: "https://mumbai.polygonscan.com/tx/",
    explorerAddressUrl: "https://mumbai.polygonscan.com/address/"
  },
  {
    name: "Fantom Testnet",
    chainId: 4002,
    img: "ftm",
    rpc: "https://rpc.testnet.fantom.network/",
    symbol: "FTM",
    env: "testnet",
    explorerName: "FTMScan",
    explorerTxUrl: "https://testnet.ftmscan.com/tx/",
    explorerAddressUrl: "https://testnet.ftmscan.com/address/"
  },
  {
    name: "AminoX Testnet",
    chainId: 13370,
    img: "amio",
    symbol: "ACT",
    env: "testnet",
    explorerName: "AminoX Explorer",
    explorerTxUrl: "https://aminoxtestnet.blockscout.alphacarbon.network/tx/",
    explorerAddressUrl: "https://aminoxtestnet.blockscout.alphacarbon.network/address/"
  }
];

export const updateNetworks = (options: { networks?: INetwork[] | '*', infuraId?: string }) => {
  if (options.infuraId) {
    setInfuraId(options.infuraId);
  }
  if (options.networks) {
    setNetworkList(options.networks, options.infuraId);
  }
};

export function getChainId() {
  return Wallet.getInstance().chainId;
};

export function getWalletProvider() {
  return localStorage.getItem('walletProvider') || '';
};

const state = {
  networkMap: {} as { [key: number]: INetwork },
  infuraId: '',
}

function getWallet() {
  return Wallet.getInstance();
};

const setNetworkList = (networkList: INetwork[] | '*', infuraId?: string) => {
  state.networkMap = {};
  if (networkList === '*') {
    const wallet: Wallet = getWallet() as Wallet;
    const networksMap = wallet.networksMap;
    for (const chainId in networksMap) {
      const networkInfo = networksMap[chainId];
      const rpc = networkInfo.rpcUrls && networkInfo.rpcUrls.length ? networkInfo.rpcUrls[0] : '';
      const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
      state.networkMap[networkInfo.chainId] =  {
        chainId: networkInfo.chainId,
        name: networkInfo.chainName,
        rpc: state.infuraId && rpc ? rpc.replace(/{InfuraId}/g, state.infuraId) : rpc,
        symbol: networkInfo.nativeCurrency?.symbol || '',
        explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith('/') ? '' : '/'}tx/` : '',
        explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith('/') ? '' : '/'}address/` : '',
      }
    }
    return;
  }
  networks.forEach(network => {
    const rpc = infuraId && network.rpc ? network.rpc.replace(/{InfuraId}/g, infuraId) : network.rpc;
    state.networkMap[network.chainId] = { ...network, isDisabled: true, rpc };
  })
  if (Array.isArray(networkList)) {
    for (let network of networkList) {
      if (infuraId && network.rpc) {
        network.rpc = network.rpc.replace(/{InfuraId}/g, infuraId);
      }
      Object.assign(state.networkMap[network.chainId], { isDisabled: false, ...network });
    }
  }
}

export const getNetworkInfo = (chainId: number): INetwork | undefined => {
  return state.networkMap[chainId];
}

export const getNetworkList = () => {
  return Object.values(state.networkMap);
}

export const getNetworkType = (chainId: number) => {
  let network = getNetworkInfo(chainId);
  return network?.explorerName ?? 'Unknown';
}

export const getNetworkExplorerName = (chainId: number) => {
  if (getNetworkInfo(chainId)) {
    return getNetworkInfo(chainId).explorerName;
  }
  return null;
}

const setInfuraId = (infuraId: string) => {
  state.infuraId = infuraId;
}

export const getInfuraId = () => {
  return state.infuraId;
}

export const viewOnExplorerByTxHash = (chainId: number, txHash: string) => {
  let network = getNetworkInfo(chainId);
  if (network && network.explorerTxUrl) {
    let url = `${network.explorerTxUrl}${txHash}`;
    window.open(url);
  }
}

export const viewOnExplorerByAddress = (chainId: number, address: string) => {
  let network = getNetworkInfo(chainId);
  if (network && network.explorerAddressUrl) {
    let url = `${network.explorerAddressUrl}${address}`;
    window.open(url);
  }
}

export { parseContractError } from './error';
