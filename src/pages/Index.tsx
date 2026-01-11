import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { WhyItMattersSection } from '@/components/landing/WhyItMattersSection';
import { FAQSection } from '@/components/landing/FAQSection';

import { ContactSection } from '@/components/landing/ContactSection';
import { Footer } from '@/components/landing/Footer';
import { useEmailAuth } from '@/hooks/useEmailAuth';

interface IndexProps {
  onSignOut: () => void;
}

const Index = ({ onSignOut }: IndexProps) => {
  const { user } = useEmailAuth();

  return (
    <div className="min-h-screen bg-background landing-cursor-pointer">
      <Navbar user={user} onSignOut={onSignOut} />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <UseCasesSection />
        <HowItWorksSection />
        <WhyItMattersSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
