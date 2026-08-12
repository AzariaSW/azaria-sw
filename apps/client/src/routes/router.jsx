import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layouts/RootLayout/RootLayout";
import HomePage from "../pages/HomePage/HomePage";
import adminRoutes from "./adminRouter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },

  ...adminRoutes,
]);

export default router;
