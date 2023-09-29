import { StarIcon } from '@heroicons/react/24/solid';

export const navigation = [
  { name: 'Tokens', href: '/', icon: 'token' },
  { name: 'Pairs', href: '/pairs', icon: 'ring' },
  { name: 'Farming', href: '/farming', icon: 'sprout' },
  { name: 'Burning Tracker', href: '/tracker', icon: 'flame' },
  {
    name: 'Charts & Swaps',
    href: { pathname: '/charts', query: { token: 'CERES' } },
    icon: 'chart',
  },
  { name: 'Portfolio', href: '/portfolio', icon: StarIcon },
];

export const websites = [
  {
    name: 'Ceres dApps',
    href: 'https://dapps.cerestoken.io',
    icon: '/dapps.png',
  },
  {
    name: 'Demeter Farming',
    href: 'https://farming.deotoken.io',
    icon: '/farming.svg',
  },
  { name: 'Deo Arena', href: 'https://deoarena.io', icon: '/deoarena.svg' },
];

export const socials = [
  { href: 'https://t.me/cerestoken', icon: 'telegram' },
  { href: 'https://twitter.com/TokenCeres', icon: 'twitter' },
  { href: 'https://t.me/ceres_polkaswap_bot', icon: 'chat' },
];

export const docs = [
  {
    href: 'https://ceres-token.s3.eu-central-1.amazonaws.com/docs/Ceres%20Litepaper.pdf',
    icon: '/ceres.svg',
  },
  {
    href: 'https://ceres-token.s3.eu-central-1.amazonaws.com/docs/Demeter%20Litepaper.pdf',
    icon: '/demeter.svg',
  },
  {
    href: 'https://ceres-token.s3.eu-central-1.amazonaws.com/docs/Hermes%20Litepaper.pdf',
    icon: '/hermes.svg',
  },
  { href: '/', icon: '/apollo.svg' },
];
