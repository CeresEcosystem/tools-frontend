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
  pswapGrossBurn: number;
  pswapNetBurn: number;
  pswapRemintedLp: number;
  pswapRemintedParliament: number;
  xorSpent: number;
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
