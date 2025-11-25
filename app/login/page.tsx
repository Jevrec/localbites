"use client";

import { Suspense, lazy } from "react";
import LoginSkeleton from "../skeletons/LoginSkeleton";


const LoginForm = lazy(() => import("../components/loginForm"));

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}