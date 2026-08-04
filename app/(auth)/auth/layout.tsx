import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eceef8] via-[#f5f6fb] to-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(120,130,180,0.12),_transparent_55%)]" />
      <header className="relative z-10 px-6 pt-8 text-center">
        <div className="inline-flex items-center gap-2 text-[var(--color-navy)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-navy)] text-sm font-bold text-white">
            H
          </span>
          <span className="text-lg font-semibold tracking-tight">HireOS</span>
        </div>
      </header>
      <main className="relative z-10 flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-10">
        {children}
      </main>
      <footer className="relative z-10 pb-0">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-gray-600">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-600">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-600">
            Contact Support
          </a>
        </div>
        <div className="flex items-center justify-between bg-[#e8eaf3] px-6 py-3 text-xs text-gray-500">
          <span>HireOS © 2024 HireOS. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-700">
              Security
            </a>
            <a href="#" className="hover:text-gray-700">
              Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
