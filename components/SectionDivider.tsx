export default function SectionDivider() {
  return (
    <div className="w-full flex items-center justify-center relative z-20 -my-px pointer-events-none">
      <div className="flex-grow max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-gold/50"></div>
      <div className="w-2 h-2 rotate-45 border border-gold/50 bg-navy mx-4 shrink-0"></div>
      <div className="flex-grow max-w-3xl h-[1px] bg-gradient-to-l from-transparent via-gold/30 to-gold/50"></div>
    </div>
  );
}
