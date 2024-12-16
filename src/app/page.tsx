"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/pages/auth/Login");
  }, [router]);

  return null; // No renderiza nada mientras redirige
}
