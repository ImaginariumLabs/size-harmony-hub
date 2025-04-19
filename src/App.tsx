
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Guide from "./pages/Guide";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ReverseLookup from "./pages/ReverseLookup";
import ConnectionStatus from "./components/ConnectionStatus";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HelmetProvider>
          <Helmet>
            <title>Size Converter | Find Your Perfect Size Across Brands</title>
            <meta name="description" content="Convert your measurements between different clothing brands and sizes. Find your perfect fit with our accurate size calculator." />
            <meta name="keywords" content="size converter, clothing size, size calculator, measurement converter, fashion sizes, brand sizes" />
            <meta property="og:title" content="Size Converter | Find Your Perfect Size" />
            <meta property="og:description" content="Convert your measurements between different clothing brands and sizes. Find your perfect fit with our accurate size calculator." />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
          </Helmet>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/reverse-lookup" element={<ReverseLookup />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <ConnectionStatus />
            </Router>
          </AuthProvider>
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
