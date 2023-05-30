import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'react-tooltip';

export default function Clipboard({
  text,
  textToCopy,
  children,
}: {
  text: string;
  textToCopy?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <CopyToClipboard data-tooltip-id="clipboard" text={textToCopy ?? text}>
        {children}
      </CopyToClipboard>
      <Tooltip
        id="clipboard"
        content="Copied!"
        openOnClick
        delayHide={1000}
        place="top"
        className="!bg-pink rounded-lg"
      />
    </>
  );
}
