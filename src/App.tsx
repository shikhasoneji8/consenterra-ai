import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Solutions from "./pages/Solutions";
import PriXplainer from "./pages/solutions/PriXplainer";
import FoundrFATE from "./pages/solutions/FoundrFATE";
import TrustEarthy from "./pages/solutions/TrustEarthy";
import Extension from "./pages/Extension";
import Privacy from "./pages/Privacy";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ChromePrivacy from "./pages/chrome-privacy"; // adjust path to match your project

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/solutions/prixplainer" element={<PriXplainer />} />
              <Route path="/solutions/foundrfate" element={<FoundrFATE />} />
              <Route path="/solutions/trusteartthy" element={<TrustEarthy />} />
              <Route path="/extension" element={<Extension />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/career" element={<Career />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/chrome-privacy" element={<ChromePrivacy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
