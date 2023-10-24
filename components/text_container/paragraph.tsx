export default function Paragraph({
  paragraph,
  importantText,
}: {
  paragraph: string;
  importantText?: string;
}) {
  return (
    <p className="text-white text-sm text-opacity-70">
      {importantText && (
        <span className="text-white font-bold">{importantText}</span>
      )}
      {paragraph}
    </p>
  );
}
