import { useState, useRef } from "react";
import { Briefcase, MapPin, Clock, CheckCircle, Code, Send, Loader2, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const roles = [
  { id: "design-intern", title: "Design and Advertising Intern" },
  { id: "swe-intern", title: "Software Engineering Intern" },
  { id: "general", title: "General Application" },
];

const designResponsibilities = [
  "Brand design & visual assets creation",
  "Website & campaign design",
  "Social media planning and content creation",
  "Competitor analysis and market research",
];

const designSkills = [
  "Canva, Adobe Creative Suite, MS Office",
  "AI/LLM tools for content creation",
  "Website development basics",
  "Creative strategy and ideation",
];

const sweResponsibilities = [
  "Develop and maintain web applications using React and TypeScript",
  "Build and integrate APIs and backend services",
  "Collaborate on AI-powered feature development",
  "Write clean, tested, and documented code",
];

const sweSkills = [
  "React, TypeScript, JavaScript",
  "REST APIs and database fundamentals",
  "Git version control",
  "Problem-solving and debugging skills",
];

const benefits = [
  "Portfolio-ready work with real impact",
  "Direct mentorship from founders",
  "Contribute to meaningful, ethical tech",
  "Networking opportunities in AI & sustainability",
];

export default function Career() {
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    linkedinUrl: "",
    portfolioUrl: "",
    coverLetter: "",
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload resume to storage
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}_${formData.fullName.replace(/\s+/g, '_')}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload resume");
      }

      // Get the file path
      const resumeUrl = uploadData.path;

      // Save to database
      const { error } = await supabase
        .from("job_applications")
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          role: formData.role,
          linkedin_url: formData.linkedinUrl || null,
          portfolio_url: formData.portfolioUrl || null,
          resume_url: resumeUrl,
          cover_letter: formData.coverLetter || null,
        });

      if (error) throw error;

      // Send email notification to team
      try {
        const { data, error } = await supabase.functions.invoke(
          "send-application-notification",
          {
            body: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone || null,
              role: formData.role,
              linkedinUrl: formData.linkedinUrl || null,
              portfolioUrl: formData.portfolioUrl || null,
              coverLetter: formData.coverLetter || null,
              resumeFileName: resumeFile?.name || null,
            },
          }
        );
      
        if (error) {
          console.error("Failed to send notification email:", error);
        }
      } catch (e) {
        console.error("Failed to send notification email (thrown):", e);
      }

      setSubmitted(true);
      setResumeFile(null);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="section-container text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
            <Briefcase className="h-7 w-7" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Join Our Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be part of a mission-driven team building AI solutions that empower everyday decisions.
          </p>
        </div>
      </section>

      {/* About ConsenTerra */}
      <section className="py-12">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">About ConsenTerra</h2>
            <p className="text-muted-foreground leading-relaxed">
              ConsenTerra, Inc. is an AI-powered solutions company focused on bringing clarity to 
              everyday decisions. Our tools help users navigate privacy, sustainability, and 
              strategic choices with confidence. We're building technology that's trustworthy, 
              transparent, and human-centered.
            </p>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Open Positions</h2>
            
            {/* Design Intern Role */}
            <div className="bg-background rounded-2xl border border-border p-8 mb-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Design and Advertising Intern
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      100% Remote
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Jan 2026 – May 2026
                    </span>
                  </div>
                </div>
                <Button onClick={scrollToForm}>
                  Apply Now
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Responsibilities</h4>
                  <ul className="space-y-2">
                    {designResponsibilities.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Skills Required</h4>
                  <ul className="space-y-2">
                    {designSkills.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">What's In It For You</h4>
                  <ul className="space-y-2">
                    {benefits.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Software Engineering Intern Role */}
            <div className="bg-background rounded-2xl border border-border p-8 mb-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500">
                      <Code className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Software Engineering Intern
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      100% Remote
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Jan 2026 – May 2026
                    </span>
                  </div>
                </div>
                <Button onClick={scrollToForm}>
                  Apply Now
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Responsibilities</h4>
                  <ul className="space-y-2">
                    {sweResponsibilities.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Skills Required</h4>
                  <ul className="space-y-2">
                    {sweSkills.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">What's In It For You</h4>
                  <ul className="space-y-2">
                    {benefits.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-muted/30" ref={formRef}>
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Apply Now</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you soon.
              </p>
            </div>

            {submitted ? (
              <div className="bg-background rounded-2xl border border-primary/30 p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Application Received!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for your interest in joining ConsenTerra. We'll review your application and get back to you within a week.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Submit Another Application
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-background rounded-2xl border border-border p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Position *</Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.title}>
                            {role.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio / GitHub</Label>
                    <Input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Resume (PDF or Word) *</Label>
                  <input
                    ref={fileInputRef}
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 p-4 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  >
                    {resumeFile ? (
                      <>
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm text-foreground">{resumeFile.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload your resume</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Max file size: 10MB</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Why do you want to join ConsenTerra?</Label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and why you're interested in this role..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}