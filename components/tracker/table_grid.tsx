export default function TableGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-16 w-full flex flex-col space-y-8 overflow-x-hidden">
      {children}
    </div>
  );
}
