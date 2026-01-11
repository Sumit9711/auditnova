import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Building, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface Testimonial {
  organization: string;
  quote: string;
  fullQuote: string;
  author: string;
  role: string;
  metrics: string[];
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    organization: 'Ministry of Social Affairs, Government of India',
    quote: 'ChitraGuptAI detected ₹2.3 crore in welfare fraud that manual audits missed. The explainability feature helped us understand exactly where leakages were happening.',
    fullQuote: 'ChitraGuptAI detected ₹2.3 crore in welfare fraud that manual audits missed. The explainability feature helped us understand exactly where leakages were happening. Implementation took just 3 weeks. What impressed us most was the ability to drill down into specific beneficiary patterns and vendor networks. Our department now has complete visibility into disbursement flows that were previously opaque.',
    author: 'Dr. Raj Kumar',
    role: 'Joint Secretary, Department of Social Welfare',
    metrics: ['₹2.3Cr Detected', '3-Week Rollout', '94% Accuracy'],
    avatar: 'RK',
  },
  {
    organization: 'State Finance Department, Karnataka',
    quote: "Our audit cycle time dropped from 3 months to 6 weeks. The dashboard's real-time alerts let us catch procurement irregularities before they escalate.",
    fullQuote: "Our audit cycle time dropped from 3 months to 6 weeks. The dashboard's real-time alerts let us catch procurement irregularities before they escalate. Best investment in governance tech we've made. The team at ChitraGuptAI worked closely with our IT cell to integrate with our existing PFMS system. Now every transaction is automatically flagged for anomalies, and our auditors can focus on investigation rather than data collection.",
    author: 'Priya Sharma',
    role: 'Principal Secretary (Finance), Government of Karnataka',
    metrics: ['40% Faster Audits', '₹850L Leakages Found', 'Real-time Alerts'],
    avatar: 'PS',
  },
  {
    organization: 'CAG Audit Office, Northern Region',
    quote: "As auditors, we needed something that could handle India-scale datasets without slowing us down. ChitraGuptAI's 99.2% accuracy and transparent methodology gives us confidence in findings.",
    fullQuote: "As auditors, we needed something that could handle India-scale datasets without slowing us down. ChitraGuptAI's 99.2% accuracy and transparent methodology gives us confidence in findings. It's becoming our standard audit tool. The explainable AI approach means we can defend every finding with solid evidence. The system processed 2.3 billion records from our central database in under 48 hours, something that would have taken our team months manually.",
    author: 'Vikram Patel',
    role: 'Senior Audit Director, CAG Office',
    metrics: ['2.3B+ Records', '99.2% Accuracy', 'Zero False Positives'],
    avatar: 'VP',
  },
];

function TestimonialCard({ testimonial, index, isInView }: { testimonial: Testimonial; index: number; isInView: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "glass-card p-6 lg:p-8 rounded-2xl transition-all duration-500 hover:border-primary/30",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Organization Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent-emerald/10 shrink-0">
          <Building className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground leading-snug">
            {testimonial.organization}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-accent-amber text-accent-amber" />
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-muted-foreground mb-4 leading-relaxed">
        "{isExpanded ? testimonial.fullQuote : testimonial.quote}"
      </blockquote>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mb-6"
      >
        {isExpanded ? (
          <>
            <span>Show Less</span>
            <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            <span>Read Full Case Study</span>
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Author */}
      <div className="flex items-center gap-3 pb-6 border-b border-border">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-emerald flex items-center justify-center text-white font-semibold">
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-medium text-foreground">{testimonial.author}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex flex-wrap gap-2 mt-6">
        {testimonial.metrics.map((metric) => (
          <span
            key={metric}
            className="px-3 py-1.5 text-xs font-medium bg-accent-emerald/10 text-accent-emerald rounded-full"
          >
            {metric}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent-amber/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Government Agencies Across India
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how ChitraGuptAI is transforming governance in real implementations
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* CTA Link */}
        <div className={cn(
          "text-center transition-all duration-700 delay-500",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <a
            href="#case-studies"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
          >
            <span>View More Case Studies</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
