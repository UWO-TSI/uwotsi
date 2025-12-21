import type { ReactNode } from "react";
import CompaniesNavbar from "@/components/layout/CompaniesNavbar";

export default function CompaniesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <CompaniesNavbar />
      <main className="pt-[96px]">{children}</main>
    </>
  );
}