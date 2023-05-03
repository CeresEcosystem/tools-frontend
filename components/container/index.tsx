export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-14 px-4 max-w-4xl mx-auto md:px-8 md:mt-20 lg:px-4 xl:px-8">
      {children}
    </div>
  );
}
