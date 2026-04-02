import PublicationsClient from "@/components/PublicationClient";
import { Suspense } from "react";

export default function PublicationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      Loading publications...
    </div>}>
    <PublicationsClient/>
      
    </Suspense>
  );
}
