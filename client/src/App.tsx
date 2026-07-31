import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Compliance from "./pages/Compliance";
import Charter from "./pages/Charter";
import Regulatory from "./pages/Regulatory";
import CrossSector from "./pages/CrossSector";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import NavLayout from "./components/NavLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        {() => <NavLayout><Dashboard /></NavLayout>}
      </Route>
      <Route path="/compliance">
        {() => <NavLayout><Compliance /></NavLayout>}
      </Route>
      <Route path="/charter">
        {() => <NavLayout><Charter /></NavLayout>}
      </Route>
      <Route path="/regulatory">
        {() => <NavLayout><Regulatory /></NavLayout>}
      </Route>
      <Route path="/cross-sector">
        {() => <NavLayout><CrossSector /></NavLayout>}
      </Route>
      <Route path="/register" component={Register} />
      <Route path="/admin">
        {() => <NavLayout><Admin /></NavLayout>}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

