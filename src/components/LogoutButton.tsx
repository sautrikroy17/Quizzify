"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors group relative">
      <LogOut className="w-5 h-5" />
      <span className="absolute top-10 right-0 w-max bg-black text-xs text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Sign Out
      </span>
    </button>
  );
}
