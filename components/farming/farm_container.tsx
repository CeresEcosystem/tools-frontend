export default function FarmContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 xxs:grid-cols-2 sm:grid-cols-3">{children}</div>
  );
}
