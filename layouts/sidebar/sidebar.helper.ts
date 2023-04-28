import DeoArena from '@public/deoarena.svg';
import Farming from '@public/farming.svg';
import Dapps from '@public/dapps.png';
import Ceres from '@public/ceres.svg';
import Demeter from '@public/demeter.svg';
import Hermes from '@public/hermes.svg';
import Apollo from '@public/apollo.svg';

export const navigation = [
  { name: 'Tokens', href: '/', icon: 'token' },
  { name: 'Pairs', href: '/pairs', icon: 'ring' },
  { name: 'Farming', href: '/farming', icon: 'sprout' },
  { name: 'Burning Tracker', href: '/tracker', icon: 'flame' },
  { name: 'Charts', href: '/charts', icon: 'chart' },
];

export const websites = [
  { name: 'Ceres dApps', href: 'https://dapps.cerestoken.io', icon: Dapps },
  {
    name: 'Demeter Farming',
    href: 'https://farming.deotoken.io',
    icon: Farming,
  },
  { name: 'Deo Arena', href: 'https://deoarena.io', icon: DeoArena },
];

export const socials = [
  { href: 'https://t.me/cerestoken', icon: 'telegram' },
  { href: 'https://twitter.com/TokenCeres', icon: 'twitter' },
  { href: 'https://t.me/ceres_polkaswap_bot', icon: 'chat' },
];

export const docs = [
  { href: 'https://ceres-token.s3.eu-central-1.amazonaws.com/docs/Ceres%20Litepaper.pdf', icon: Ceres },
  { href: 'https://ceres-token.s3.eu-central-1.amazonaws.com/docs/Demeter%20Litepaper.pdf', icon: Demeter },
  { href: 'https://ceres-token.s3.eu-central-1.amazonaws.com/docs/Hermes%20Litepaper.pdf', icon: Hermes },
  { href: '/', icon: Apollo },
];
