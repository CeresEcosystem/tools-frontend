/* eslint-disable no-unused-vars */
import { ChangeEvent } from 'react';

export interface Banner {
  sm: string;
  md: string;
  lg: string;
  link: string;
  title: string;
}

export interface AppContextType {
  banners: Banner[] | null;
}

export interface Lock {
  account: string;
  locked: number;
  timestamp: number;
  lockedFormatted: string | '';
  timestampFormatted: string | '';
}

export interface Pair {
  token: string;
  tokenFullName: string;
  tokenAssetId: string;
  baseAsset: string;
  baseAssetFullName: string;
  baseAssetId: string;
  liquidity?: number;
  baseAssetLiq: number;
  targetAssetLiq: number;
  lockedLiquidity: number;
  volume?: number;
  baseLiquidityFormatted: string | '';
  tokenLiquidityFormatted: string | '';
  liquidityFormatted: string | '';
  volumeFormatted: string | '';
  lockedLiquidityFormatted: string;
}

export interface PairData {
  allData: Pair[];
  liquidity: string;
  volume: string;
  baseAssets: string[];
}

export interface PairsReturnType {
  pairs: Pair[];
  totalPages: number;
  currentPage: number;
  totalLiquidity: string;
  totalVolume: string;
  baseAssets: string[];
  selectedBaseAsset: string;
  handleBaseAssetChange: (bAsset: string) => void;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  handlePairSearch: (search: ChangeEvent<HTMLInputElement>) => void;
}

export interface Token {
  token: string;
  price: number;
  assetId: string;
  fullName: string;
  lockedTokens: number;
  assetIdFormatted: string | '';
  priceFormatted: string | '';
}

export interface TokensReturnType {
  tokens: Token[];
  totalPages: number;
  currentPage: number;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  handleTokenSearch: (search: ChangeEvent<HTMLInputElement>) => void;
}

export interface Block {
  blockNum: number;
  grossBurn: number;
  netBurn: number;
  remintedLp: number;
  remintedParliament: number;
  xorSpent: number;
  xorDedicatedForBuyBack: number;
}

export interface BurnObject {
  gross: number;
  net: number;
}

export interface Burn {
  [key: string]: BurnObject;
}

export interface Burning {
  x: string;
  y: number;
  spent: number;
  lp: number;
  parl: number;
  net: number;
  back: number;
}

export interface Supply {
  x: string;
  y: string;
}

export interface TrackerData {
  blocks: Block[];
  last: number;
  burn: Burn;
  graphBurning: Burning[];
  graphSupply: Supply[];
}

export interface ModalTokens {
  show: boolean;
  item: Token | null;
  locks: Lock[];
}

export interface ModalSupply {
  show: boolean;
  item: Token | null;
  supply: Supply[];
}

export interface Reward {
  apr: string;
  rewards: number;
  aprDouble: string;
  rewardsDouble: string;
}

export interface ModalPairs {
  show: boolean;
  item: Pair | null;
  locks: Lock[];
}

export interface FAQ {
  question: string;
  answer: string | string[];
  link?: string;
}

export interface Tab {
  name: string;
}

export interface TVL {
  maxSupply: number;
  currentSupply: number;
  tvl: number;
  burned: number;
}

export interface FarmData {
  poolAsset: string;
  rewardAsset: string;
  baseAssetId: string;
  baseAsset: string;
  multiplier: number;
  isCore: boolean;
  multiplierPercent: string;
  isRemoved: boolean;
  token: string;
  apr: number;
  earn: string;
  totalLiquidity: number;
  depositFee: number;
}

export interface PoolData {
  poolAsset: string;
  rewardAsset: string;
  multiplier: number;
  isCore: boolean;
  multiplierPercent: string;
  isRemoved: boolean;
  depositFee: number;
  totalStaked: number;
  token: string;
  earn: string;
  stakedTotal: number;
  apr: number;
}

export interface FarmAndPoolData {
  farms: FarmData[];
  pools: PoolData[];
}

export interface Farm {
  poolAsset: string;
  rewardAsset: string;
  baseAssetId: string;
  baseAsset: string;
  multiplier: number;
  isCore: boolean;
  multiplierPercent: string;
  isRemoved: boolean;
  depositFee: number;
  tvlPercent: string;
  pooledTokens: number;
  rewards: number;
}

export interface Pool {
  poolAsset: string;
  rewardAsset: string;
  multiplier: number;
  isCore: boolean;
  multiplierPercent: string;
  isRemoved: boolean;
  depositFee: number;
  totalStaked: number;
}

export interface TokenInfoObject {
  tokenPerBlock: string;
  farmsAllocation: string;
  stakingAllocation: string;
}

export interface TokenInfo {
  [key: string]: TokenInfoObject;
}

export interface PortfolioItem {
  fullName: string;
  token: string;
  price: number;
  balance: number;
  value: number;
  oneHour: number;
  oneHourValueDifference: number;
  oneDay: number;
  oneDayValueDifference: number;
  oneWeek: number;
  oneWeekValueDifference: number;
  oneMonth: number;
  oneMonthValueDifference: number;
}

export interface PortfolioStakingRewardsItem {
  fullName: string;
  token: string;
  price: number;
  balance: number;
  value: number;
}

export interface PortfolioLiquidityItem {
  token: string;
  baseAsset: string;
  value: number;
}

export interface PortfolioTab {
  tab: string;
  permalink: string;
}
