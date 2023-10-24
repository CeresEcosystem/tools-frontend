export default function ParagraphTitle({ title }: { title: string }) {
  return (
    <h1 className="text-white pt-16 font-bold text-lg md:text-xl">{title}</h1>
  );
}
