import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'react-tooltip';

export default function Clipboard({
  id = 'clipboard',
  text,
  textToCopy,
  children,
}: {
  id?: string;
  text: string;
  textToCopy?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <CopyToClipboard data-tooltip-id={id} text={textToCopy ?? text}>
        {children}
      </CopyToClipboard>
      <Tooltip
        id={id}
        content="Copied!"
        events={['click']}
        delayHide={1000}
        place="top"
        className="!bg-pink rounded-lg"
      />
    </>
  );
}
