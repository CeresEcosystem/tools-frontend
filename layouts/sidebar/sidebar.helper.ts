import { StarIcon } from '@heroicons/react/24/solid';
import { SideMenuNavigationItem } from '@interfaces/index';
import { FaCoins } from 'react-icons/fa';

export const navigation: SideMenuNavigationItem[] = [
  { name: 'Tokens', href: '/', icon: 'token' },
  { name: 'Pairs', href: '/pairs', icon: 'ring' },
  { name: 'Farming', href: '/farming', icon: 'sprout' },
  { name: 'Burning Tracker', href: '/tracker', icon: 'flame' },
  {
    name: 'Charts & Swaps',
    href: '/charts',
    icon: 'chart',
  },
  { name: 'Portfolio', href: '/portfolio', icon: StarIcon },
  { name: 'TBC Reserves', href: '/tbc-reserves', icon: FaCoins },
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
  { href: 'https://apollo-protocol.gitbook.io', icon: '/apollo.svg' },
];

export const links = [
  {
    href: '/privacy-policy',
    title: 'Privacy Policy',
  },
  {
    href: '/terms-of-use',
    title: 'Terms of Use',
  },
];
