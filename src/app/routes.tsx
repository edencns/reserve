import { createBrowserRouter, Navigate } from "react-router";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import EventsListPage from "./pages/EventsListPage";
import EventReservationPage from "./pages/EventReservationPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import KioskPage from "./pages/KioskPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminReservationsPage from "./pages/admin/AdminReservationsPage";
import AdminVendorsPage from "./pages/admin/AdminVendorsPage";
import AdminContractsPage from "./pages/admin/AdminContractsPage";
import AdminStatisticsPage from "./pages/admin/AdminStatisticsPage";
import AdminSettlementPage from "./pages/admin/AdminSettlementPage";
import AdminCompanyPage from "./pages/admin/AdminCompanyPage";
import AdminEventEditPage from "./pages/admin/AdminEventEditPage";
import AdminParticipationFeePage from "./pages/admin/AdminParticipationFeePage";
import ContractUploadPage from "./pages/ContractUploadPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import { getCurrentUser } from "./mockData";

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "contract-upload", Component: ContractUploadPage },
      { path: "events", Component: EventsListPage },
      { path: "e/:slug", Component: EventReservationPage },
      { path: "my-tickets", Component: MyTicketsPage },
      { path: "kiosk/:slug", Component: KioskPage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "admin/login", Component: AdminLoginPage },
      { path: "admin", Component: () => <RequireAdmin><AdminDashboard /></RequireAdmin> },
      { path: "admin/events", Component: () => <RequireAdmin><AdminEventsPage /></RequireAdmin> },
      { path: "admin/events/:id/edit", Component: () => <RequireAdmin><AdminEventEditPage /></RequireAdmin> },
      { path: "admin/reservations", Component: () => <RequireAdmin><AdminReservationsPage /></RequireAdmin> },
      { path: "admin/vendors", Component: () => <RequireAdmin><AdminVendorsPage /></RequireAdmin> },
      { path: "admin/participation-fees", Component: () => <RequireAdmin><AdminParticipationFeePage /></RequireAdmin> },
      { path: "admin/contracts", Component: () => <RequireAdmin><AdminContractsPage /></RequireAdmin> },
      { path: "admin/statistics", Component: () => <RequireAdmin><AdminStatisticsPage /></RequireAdmin> },
      { path: "admin/settlement", Component: () => <RequireAdmin><AdminSettlementPage /></RequireAdmin> },
      { path: "admin/company", Component: () => <RequireAdmin><AdminCompanyPage /></RequireAdmin> },
    ],
  },
]);
