export default function Title({
  title,
  subtitle,
  topMargin = false,
}: {
  title: string;
  subtitle?: string;
  topMargin?: boolean;
}) {
  return (
    <div className={`${topMargin && 'mt-24'}`}>
      <h2 className="text-3xl text-white font-bold text-center">{title}</h2>
      {subtitle && (
        <p className="text-center mt-1 text-white text-opacity-50 text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
