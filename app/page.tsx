import { Suspense } from "react";
import MainPage from "./components/MainPage";

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-foreground"></div>
      </div>
    }>
      <MainPage />
    </Suspense>
  );
}