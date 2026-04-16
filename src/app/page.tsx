import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://gearforge.blog/en",
  },
};

export default function RootPage() {
  redirect("/en");
}
