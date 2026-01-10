import { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { WhyItMattersSection } from '@/components/landing/WhyItMattersSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { ROICalculatorSection } from '@/components/landing/ROICalculatorSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { ImplementationSection } from '@/components/landing/ImplementationSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { Footer } from '@/components/landing/Footer';
import { AuthModal } from '@/components/auth/AuthModal';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLaunchDashboard = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSignInClick={() => setIsAuthModalOpen(true)} />
      
      <main>
        <HeroSection onLaunchDashboard={handleLaunchDashboard} />
        <FeaturesSection />
        <UseCasesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <WhyItMattersSection />
        <SecuritySection />
        <ROICalculatorSection />
        <FAQSection />
        <ImplementationSection />
        <ContactSection />
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
