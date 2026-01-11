import { useState } from 'react';
import { Send, Building2, Mail, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FormData {
  name: string;
  organization: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  organization?: string;
  email?: string;
  message?: string;
}

export function ContactSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    organization: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Demo request submitted!', {
      description: 'Our team will contact you within 24 hours.',
    });

    setFormData({ name: '', organization: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 relative"
    >
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Contact Card */}
          <div
            className={cn(
              "p-8 md:p-12 rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-700",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <span className="inline-block text-sm font-medium text-primary mb-4">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Talk to <span className="gradient-text">Our Team</span>
              </h2>
              <p className="text-muted-foreground">
                Ready to transform your governance analytics? 
                Let's discuss how ChitraGuptAI can help your organization.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={cn(
                      "pl-10 h-12",
                      errors.name && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Organization */}
              <div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Organization"
                    value={formData.organization}
                    onChange={(e) => handleChange('organization', e.target.value)}
                    className={cn(
                      "pl-10 h-12",
                      errors.organization && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </div>
                {errors.organization && (
                  <p className="mt-1 text-sm text-destructive">{errors.organization}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Work Email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={cn(
                      "pl-10 h-12",
                      errors.email && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Textarea
                    placeholder="Tell us about your needs..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className={cn(
                      "pl-10 min-h-[120px] resize-none",
                      errors.message && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </div>
                {errors.message && (
                  <p className="mt-1 text-sm text-destructive">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 glow-primary hover:scale-[1.02] transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Request a Demo
                    <Send className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
