import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthGuard } from './components/AuthGuard';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { VerifyDocuments } from './pages/VerifyDocuments';
import { Applications } from './pages/Applications';
import { OfficeLocator } from './pages/OfficeLocator';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfUse } from './pages/TermsOfUse';
import { Feedback } from './pages/Feedback';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:serviceId" element={<ServiceDetails />} />
            <Route
              path="verify/:serviceId"
              element={
                <AuthGuard>
                  <VerifyDocuments />
                </AuthGuard>
              }
            />
            <Route
              path="applications"
              element={
                <AuthGuard>
                  <Applications />
                </AuthGuard>
              }
            />
            <Route
              path="profile"
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              }
            />
            <Route path="offices" element={<OfficeLocator />} />
            <Route path="offices/:serviceId" element={<OfficeLocator />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfUse />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="about" element={<About />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
  );
};

export default App;