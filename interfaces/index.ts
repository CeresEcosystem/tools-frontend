/* eslint-disable no-unused-vars */
import { ChangeEvent } from 'react';

export interface SideMenuNavigationItem {
  name: string;
  href: string;
  icon: any;
}

export interface PageMeta {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

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
  syntheticsFilter: boolean;
  handleSyntheticsFilter: () => void;
}

export interface Token {
  token: string;
  price: number;
  assetId: string;
  fullName: string;
  lockedTokens: number;
  assetIdFormatted: string | '';
  priceFormatted: string | '';
  isFavorite?: boolean;
}

export interface TokensReturnType {
  tokens: Token[];
  allTokens: Token[];
  totalPages: number;
  currentPage: number;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  handleTokenSearch: (search: ChangeEvent<HTMLInputElement>) => void;
  addTokenToFavorites: (token: Token) => void;
  removeTokenFromFavorites: (token: Token) => void;
  filters: string[];
  filter: string;
  toggleFilter: (filter: string) => void;
  favoriteTokens: string[];
  showPriceConverter: boolean;
  setShowPriceConverter: (show: boolean) => void;
}

export interface Block {
  blockNum: number;
  burnType: string;
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

export interface ModalTokenHolders {
  show: boolean;
  item: Token | null;
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

export interface ModalPairsLiquidity {
  show: boolean;
  item: Pair | null;
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
  baseAssetLiqHolding: number;
  tokenLiqHolding: number;
}

export interface PortfolioTransferItem {
  sender: string;
  amount: number;
  asset: string;
  receiver: string;
  transferredAt: string;
  senderFormatted?: string;
  receiverFormatted?: string;
  tokenFormatted?: string;
}

export interface TransferData {
  data: PortfolioTransferItem[];
  meta: PageMeta;
}

export interface PortfolioTab {
  tab: string;
  permalink: string;
}

export interface WalletAddress {
  name: string;
  address: string;
  fromPolkadotExtension: boolean;
  temporaryAddress: boolean;
}

export interface PortfolioModalData {
  show: boolean;
  item: WalletAddress | null;
}

export interface Swap {
  id: string;
  swappedAt: string;
  accountId: string;
  inputAssetId: string;
  outputAssetId: string;
  assetInputAmount: number;
  assetOutputAmount: number;
  inputAsset?: string;
  outputAsset?: string;
  type?: string;
  accountIdFormatted?: string;
}

export interface SwapsData {
  data: Swap[];
  meta: PageMeta;
}

export interface PairLiquidity {
  signerId: string;
  firstAssetId: string;
  secondAssetId: string;
  firstAssetAmount: string;
  secondAssetAmount: string;
  transactionType: string;
  timestamp: number;
  firstAssetAmountFormatted?: number;
  secondAssetAmountFormatted?: number;
  transactionTypeFormatted?: string;
  timestampFormatted?: string;
  accountIdFormatted?: string;
}

export interface PairLiquidityData {
  data: PairLiquidity[];
  meta: PageMeta;
}

export interface PairLiquidityChartData {
  baseAssetSymbol: string;
  tokenAssetSymbol: string;
  liquidity: number;
  baseAssetLiq: number;
  tokenAssetLiq: number;
  updatedAt: string;
}

export interface SwapFilterData {
  dateFrom: Date | null;
  dateTo: Date | null;
  minAmount: string | null;
  maxAmount: string | null;
  token: SelectOption | '';
}

export interface SwapTokens {
  tokens: string[];
}

export interface TBCReservesItem {
  id: number;
  tokenName: string;
  tokenSymbol: string;
  balance: number;
  value: number;
  updatedAt: string;
}

export interface TBCReservesData {
  currentBalance: number;
  currentValue: number;
  data: TBCReservesItem[];
}

export interface TokenHolder {
  holder: string;
  holderFormatted?: string;
  balance: number;
  balanceFormatted?: string;
}

export interface XorTokenHolder {
  address: string;
  balance: string;
}

export interface TokenHolderData {
  data: TokenHolder[];
  meta: PageMeta;
}

export interface Currency {
  currency: string;
  sign: string;
}
