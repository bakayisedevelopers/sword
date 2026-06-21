export default function AdminHeader() {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Admin app</p>
          <h1 className="text-lg font-semibold text-white">SSMI Content Studio</h1>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">
          Vite + React dashboard shell
        </div>
      </div>
    </header>
  );
}
