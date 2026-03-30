import { createBrowserRouter } from "react-router";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "events", Component: EventsListPage },
      { path: "e/:slug", Component: EventReservationPage },
      { path: "my-tickets", Component: MyTicketsPage },
      { path: "kiosk/:slug", Component: KioskPage },
      { path: "admin/login", Component: AdminLoginPage },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/events", Component: AdminEventsPage },
      { path: "admin/reservations", Component: AdminReservationsPage },
      { path: "admin/vendors", Component: AdminVendorsPage },
      { path: "admin/contracts", Component: AdminContractsPage },
      { path: "admin/statistics", Component: AdminStatisticsPage },
      { path: "admin/settlement", Component: AdminSettlementPage },
      { path: "admin/company", Component: AdminCompanyPage },
    ],
  },
]);
