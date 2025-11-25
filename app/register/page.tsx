"use client";

import { Suspense, lazy } from "react";
import RegisterSkeleton from "../skeletons/RegisterSkeleton";

const RegisterForm = lazy(() => import("../components/registerForm"));

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Suspense fallback={<RegisterSkeleton />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}