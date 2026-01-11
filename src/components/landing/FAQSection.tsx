import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ question, answer, isOpen, onToggle, index }: FAQItemProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn(
        "border-b border-border transition-all duration-500",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-200 pr-4">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    question: 'Does ChitraGuptAI replace human auditors?',
    answer: 'No, ChitraGuptAI is designed to augment and support auditors, not replace them. It automates the initial screening of large datasets to identify high-risk records, allowing human auditors to focus their expertise on investigating flagged cases and making final decisions.',
  },
  {
    question: 'What types of data does ChitraGuptAI support?',
    answer: 'ChitraGuptAI supports any structured transactional data in CSV format. Common use cases include welfare disbursements, payroll records, procurement transactions, subsidy allocations, and scheme-wise fund flows. Custom data schemas can be configured for specific departmental needs.',
  },
  {
    question: 'Can this integrate with existing government APIs and databases?',
    answer: 'Yes, ChitraGuptAI is designed for API-first integration. It can connect to existing e-governance platforms, treasury systems, and departmental databases through secure REST APIs. We also support batch data ingestion for systems without real-time API access.',
  },
  {
    question: 'How is data security and privacy handled?',
    answer: 'Security is paramount. All data is encrypted at rest and in transit using AES-256 and TLS 1.3. We comply with government data protection guidelines and can be deployed on-premises or in government cloud environments. Role-based access control ensures data is only visible to authorized personnel.',
  },
  {
    question: 'Can small municipalities use this, or is it only for central agencies?',
    answer: 'ChitraGuptAI is designed to scale both up and down. While it handles national-level datasets with millions of records, it\'s equally effective for state, district, or municipal-level deployments. Pricing and deployment options are tailored to organization size.',
  },
  {
    question: 'What kind of anomalies can the system detect?',
    answer: 'The system detects multiple anomaly types: statistical outliers (unusual amounts, frequencies), pattern breaks (deviations from historical behavior), duplicate detection (same beneficiary across schemes), vendor clustering (unusual vendor-department relationships), and temporal anomalies (suspicious timing patterns).',
  },
  {
    question: 'How accurate is the anomaly detection?',
    answer: 'Our models achieve over 99% accuracy in detecting known fraud patterns, with a false positive rate under 5%. The system also uses explainable AI to provide clear reasons for each flag, allowing analysts to quickly validate or dismiss alerts.',
  },
  {
    question: 'What support and training is provided?',
    answer: 'We provide comprehensive onboarding including data schema setup, user training, and pilot runs with historical data. Ongoing support includes dedicated account management, documentation, and regular model updates based on emerging fraud patterns.',
  },
];

export function FAQSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      ref={ref}
      className="py-24 relative"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className={cn(
              "inline-block text-sm font-medium text-primary mb-4 transition-all duration-500",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2
            className={cn(
              "text-3xl md:text-4xl font-bold text-foreground mb-4 transition-all duration-500 delay-100",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Got Questions?{' '}
            <span className="gradient-text">We Have Answers</span>
          </h2>
          <p
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-200",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Everything you need to know about implementing ChitraGuptAI 
            in your organization.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
