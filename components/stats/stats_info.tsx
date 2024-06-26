export default function StatsInfo({
  label,
  info,
}: {
  label: string;
  info: string;
}) {
  return (
    <div className="text-center xl:text-start">
      <span className="block text-white text-opacity-50 text-sm">{label}</span>
      <span className="text-white font-semibold">{info}</span>
    </div>
  );
}
