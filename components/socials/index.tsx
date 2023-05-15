import Title from '@components/title';
import Link from 'next/link';

export const socials = [
  { href: 'https://t.me/cerestoken', icon: 'telegram' },
  { href: 'https://twitter.com/TokenCeres', icon: 'twitter' },
  { href: 'https://tokenceres.medium.com', icon: 'medium' },
];

export default function Socials() {
  return (
    <>
      <Title
        title="Join us on Social"
        subtitle="If you have any questions, contact us!"
        topMargin
      />
      <div className="flex justify-center items-center space-x-4 mt-8">
        {socials.map((social) => (
          <Link
            key={social.href}
            href={social.href}
            target="_blank"
            className="h-20 w-20 rounded-xl bg-white bg-opacity-10 flex items-end justify-center"
          >
            <i
              className={`flaticon-${social.icon} text-4xl mb-3 text-white text-center`}
            ></i>
          </Link>
        ))}
      </div>
    </>
  );
}
