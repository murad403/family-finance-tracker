"use client"

import DashboardPage from "@/components/app/dashboard/DashboardPage";
import { useFinance } from "@/context/FinanceContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const router = useRouter();
  const { isAuthenticated } = useFinance();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    } else {
      router.replace('/sign-in');
    }
  }, [isAuthenticated, router]);
  return (
    <div>
      <DashboardPage />
    </div>
  )
}

export default page