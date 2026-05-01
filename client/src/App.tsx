import React, { Suspense } from "react";
import { Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import { useLoadingStore } from "./store/useloadingStore";
import publicRoutes from "./routes/publicRoutes";
import privateRoutes from "./routes/privateRoutes";
import { useAuth } from "./lib/context";

const App: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role;
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {publicRoutes}
          {role && privateRoutes(role)}
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
