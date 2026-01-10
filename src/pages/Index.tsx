import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { WhyItMattersSection } from '@/components/landing/WhyItMattersSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { FAQSection } from '@/components/landing/FAQSection';
import { ImplementationSection } from '@/components/landing/ImplementationSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { Footer } from '@/components/landing/Footer';
import { AnalysisSection } from '@/components/dashboard/AnalysisSection';
import { useEmailAuth } from '@/hooks/useEmailAuth';

interface IndexProps {
  onSignOut: () => void;
}

const Index = ({ onSignOut }: IndexProps) => {
  const { user } = useEmailAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onSignOut={onSignOut} />
      
      <main>
        <HeroSection />
        <AnalysisSection />
        <FeaturesSection />
        <UseCasesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <WhyItMattersSection />
        <SecuritySection />
        <FAQSection />
        <ImplementationSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
