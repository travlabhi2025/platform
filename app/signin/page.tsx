import { Suspense } from "react";
import SigninPage from "@/components/auth/SigninPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SigninPage />
    </Suspense>
  );
}
