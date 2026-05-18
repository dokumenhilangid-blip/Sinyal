export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-mono text-sm tracking-widest">
      <p className="mb-4 text-[var(--color-mono)]">pattern not found.</p>
      <a
        href="/"
        className="text-[var(--color-mono-dim)] border-b border-[var(--color-hairline)] pb-1 hover:text-[var(--color-mono)] transition-colors duration-300"
      >
        return
      </a>
    </div>
  );
}
