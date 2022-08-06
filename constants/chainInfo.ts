import ethereumLogoUrl from '../assets/images/logo.png';
import { SupportedChainId, SupportedL1ChainId, SupportedL2ChainId } from './chains';

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.BSC_MAINNET]: `https://bsc-dataseed1.binance.org/`,
  [SupportedChainId.BSC_TESTNET]: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
  [SupportedChainId.HECO_MAINNET]: `https://http-mainnet.hecochain.com/`,
  [SupportedChainId.HECO_TESTNET]: `https://http-testnet.hecochain.com/`,
  [SupportedChainId.LOCALHOST]: ``
}

/**
 * This is used to call the add network RPC
 */
interface AddNetworkInfo {
  readonly rpcUrl: string
  readonly nativeCurrency: {
    name: string // e.g. 'Goerli ETH',
    symbol: string // e.g. 'gorETH',
    decimals: number // e.g. 18,
  }
}

export enum NetworkType {
  L1,
  L2
}

interface BaseChainInfo {
  readonly networkType: NetworkType
  readonly blockWaitMsBeforeWarning?: number
  readonly docs: string
  readonly bridge?: string
  readonly explorer: string
  readonly infoLink: string
  readonly officialLink: string
  readonly logoUrl: string
  readonly label: string
  readonly helpCenterUrl?: string
  readonly addNetworkInfo: AddNetworkInfo
}

export interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1
}

export interface L2ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L2
  readonly bridge: string
  readonly statusPage?: string
  readonly defaultListUrl: string
}

export type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo } & {
  readonly [chainId in SupportedL2ChainId]: L2ChainInfo
} &
  { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

export const CHAIN_INFO: ChainInfoMap = {
  [SupportedChainId.BSC_MAINNET]: {
    networkType: NetworkType.L1,
    docs: 'https://docs.daoswap.cc/',
    explorer: 'https://bscscan.com/',
    infoLink: 'https://info.bsc.daoswap.cc',
    officialLink: 'https://bsc.www.daoswap.cc',
    label: 'Binance Smart Chain Mainnet',
    logoUrl: ethereumLogoUrl,
    addNetworkInfo: {
      nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      rpcUrl: NETWORK_URLS[SupportedChainId.BSC_MAINNET]
    }
  },
  [SupportedChainId.BSC_TESTNET]: {
    networkType: NetworkType.L1,
    docs: 'https://docs.daoswap.cc/',
    explorer: 'https://testnet.bscscan.com/',
    infoLink: 'https://info.chapel.daoswap.cc',
    officialLink: 'https://bsc.www.daoswap.cc',
    label: 'Binance Smart Chain Testnet',
    logoUrl: ethereumLogoUrl,
    addNetworkInfo: {
      nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
      rpcUrl: NETWORK_URLS[SupportedChainId.BSC_TESTNET]
    }
  },
  [SupportedChainId.HECO_MAINNET]: {
    networkType: NetworkType.L1,
    docs: 'https://docs.daoswap.cc/',
    explorer: 'https://hecoinfo.com/',
    infoLink: 'https://info.heco.daoswap.cc',
    officialLink: 'https://www.daoswap.cc',
    label: 'Heco Chain Mainnet',
    logoUrl: ethereumLogoUrl,
    addNetworkInfo: {
      nativeCurrency: { name: 'HT', symbol: 'HT', decimals: 18 },
      rpcUrl: NETWORK_URLS[SupportedChainId.HECO_MAINNET]
    }
  },
  [SupportedChainId.HECO_TESTNET]: {
    networkType: NetworkType.L1,
    docs: 'https://docs.daoswap.cc/',
    explorer: 'https://testnet.hecoinfo.com/',
    infoLink: '',
    officialLink: 'https://www.daoswap.cc',
    label: 'Heco Chain Testnet',
    logoUrl: ethereumLogoUrl,
    addNetworkInfo: {
      nativeCurrency: { name: 'htt', symbol: 'htt', decimals: 18 },
      rpcUrl: NETWORK_URLS[SupportedChainId.HECO_TESTNET]
    }
  },
  [SupportedChainId.LOCALHOST]: {
    networkType: NetworkType.L1,
    docs: '',
    explorer: '',
    infoLink: '',
    officialLink: '',
    label: 'Localhost',
    logoUrl: ethereumLogoUrl,
    addNetworkInfo: {
      nativeCurrency: { name: 'loc', symbol: 'loc', decimals: 18 },
      rpcUrl: NETWORK_URLS[SupportedChainId.LOCALHOST]
    }
  }
}
