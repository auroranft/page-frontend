/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  HECO_MAINNET = 128,
  HECO_TESTNET = 256,
  LOCALHOST = 5777,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.BSC_MAINNET]: 'BSC',
  [SupportedChainId.BSC_TESTNET]: 'BscTest',
  [SupportedChainId.HECO_MAINNET]: 'HECO',
  [SupportedChainId.HECO_TESTNET]: 'HecoTest',
  [SupportedChainId.LOCALHOST]: 'Localhost',
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  id => typeof id === 'number'
) as SupportedChainId[]

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [SupportedChainId.BSC_MAINNET, SupportedChainId.HECO_MAINNET]

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
  SupportedChainId.BSC_MAINNET,
  SupportedChainId.BSC_TESTNET,
  SupportedChainId.HECO_MAINNET,
  SupportedChainId.HECO_TESTNET,
  SupportedChainId.LOCALHOST,
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]
