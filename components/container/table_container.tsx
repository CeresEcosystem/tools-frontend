export default function TableContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="my-14 px-4 max-w-6xl mx-auto md:px-8 md:mt-20 lg:px-4 xl:px-8">
      {children}
    </div>
  );
}
