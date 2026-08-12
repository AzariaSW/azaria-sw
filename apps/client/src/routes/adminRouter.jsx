import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../features/admin/dashboard/AdminDashboard";
import AdminProfile from "../features/admin/profile/AdminProfile";
import AdminProjects from "../features/admin/projects/AdminProjects";
import AdminSkills from "../features/admin/skills/AdminSkills";
import AdminExperience from "../features/admin/experience/AdminExperience";
import AdminEducation from "../features/admin/education/AdminEducation";
import AdminCertificates from "../features/admin/certificates/AdminCertificates";
import AdminMessages from "../features/admin/messages/AdminMessages";
import AdminGithub from "../features/admin/github/AdminGithub";
import AdminEntry from "../features/admin/AdminEntry";

const router = [
  {
    path: "/admin",
    element: <AdminEntry />,
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "profile",
        element: <AdminProfile />,
      },
      {
        path: "projects",
        element: <AdminProjects />,
      },
      {
        path: "skills",
        element: <AdminSkills />,
      },
      {
        path: "experience",
        element: <AdminExperience />,
      },
      {
        path: "education",
        element: <AdminEducation />,
      },
      {
        path: "certificates",
        element: <AdminCertificates />,
      },
      {
        path: "messages",
        element: <AdminMessages />,
      },
      {
        path: "github",
        element: <AdminGithub />,
      },
    ],
  },
];

export default router;
