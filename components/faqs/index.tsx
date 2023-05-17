import Title from '@components/title';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FAQ } from '@interfaces/index';
import classNames from 'classnames';
import Link from 'next/link';

export default function Faqs({ faqs }: { faqs: FAQ[] }) {
  return (
    <>
      <Title
        title="Frequently Asked Questions"
        subtitle="Here's most asked questions"
        topMargin
      />
      <div className="mt-16">
        <dl className="space-y-4">
          {faqs.map((faq) => (
            <Disclosure
              as="div"
              key={faq.question}
              className="bg-white bg-opacity-10 rounded-xl"
            >
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex p-4 w-full items-center justify-between text-left">
                      <span className="text-base flex-1 font-bold text-white md:text-lg">
                        {faq.question}
                      </span>
                      <span
                        className={classNames(
                          'ml-6 flex h-7 w-7 justify-center items-center text-white'
                        )}
                      >
                        <ChevronDownIcon
                          className={classNames(
                            open ? '-rotate-180' : 'rotate-0',
                            'h-5 w-5 transform'
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="p-4 md:pr-12">
                    {Array.isArray(faq.answer) ? (
                      <ul className="list-disc ml-4 text-white text-sm leading-6">
                        {faq.answer.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white text-sm leading-6">
                        {faq.answer}
                        {faq.link && (
                          <Link
                            href={faq.link}
                            target="_blank"
                            className="text-white font-bold text-sm"
                          >
                            {' here.'}
                          </Link>
                        )}
                      </p>
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </>
  );
}
