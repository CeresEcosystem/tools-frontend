export default function ParagraphList({ list }: { list: string[] }) {
  return (
    <ul className="list-disc px-10">
      {list.map((item) => (
        <li key={item} className="text-white text-sm text-opacity-70">
          {item}
        </li>
      ))}
    </ul>
  );
}
