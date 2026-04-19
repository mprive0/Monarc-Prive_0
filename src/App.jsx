import MonarcMembership from "./pages/LandingPage";

// Simple router - no external dependencies needed
export default function App() {
  const path = window.location.pathname;
  return <MonarcMembership />;
}
