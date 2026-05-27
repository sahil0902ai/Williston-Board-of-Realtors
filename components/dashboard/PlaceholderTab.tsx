export default function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[60vh] bg-navy-mid border border-border-subtle rounded-2xl">
      <h2 className="text-3xl font-serif mb-4">{title}</h2>
      <p className="text-gray-text max-w-md">
        This section is currently under development. Check back later for updates to the {title.toLowerCase()} dashboard.
      </p>
    </div>
  );
}
