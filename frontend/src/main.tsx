import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MeasurementHistory from "./pages/MeasurementHistory";
import ContextAPIProvider from "./contexts/ContextAPI";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/history",
    element: <MeasurementHistory />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextAPIProvider>
      <RouterProvider router={router} />
    </ContextAPIProvider>
  </StrictMode>
);
