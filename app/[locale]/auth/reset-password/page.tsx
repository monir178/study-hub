import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
