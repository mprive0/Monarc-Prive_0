import MonarcMembership from "./pages/LandingPage";
import MonarcPartnerHub from "./pages/PartnerHub";
import MonarcAgentHub from "./pages/AgentHub";

export default function App() {
  const path = window.location.pathname;

  if (path === "/partners" || path === "/partners/") {
    return <MonarcPartnerHub />;
  }

  if (path === "/admin" || path === "/admin/") {
    return <MonarcAgentHub />;
  }

  return <MonarcMembership />;
}
