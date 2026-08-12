import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../features/admin/dashboard/AdminDashboard";
import AdminEntry from "../features/admin/AdminEntry";

const router = [
  {
    path: "/admin",
    element: <AdminEntry />,
  },

  {
    path: "/admin/dashboard",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
    ],
  },
];

export default router;
