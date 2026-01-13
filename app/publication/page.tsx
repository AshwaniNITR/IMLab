import PublicationsClient from "@/components/PublicationClient";
import { P } from "framer-motion/dist/types.d-a9pt5qxk";
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
