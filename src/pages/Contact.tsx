import { useState } from "react";
import { Mail, MessageSquare, Calendar, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
    toast({
      title: "Message sent!",
      description: "We'll get back to you soon.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-[70vh]">
        <section className="flex-1 flex items-center justify-center py-20">
          <div className="section-container">
            <div className="max-w-lg mx-auto text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Thank you for reaching out.
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We truly appreciate your time and curiosity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Someone from the ConsenTerra team will be in touch soon.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-20">
        <div className="section-container text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Curious to collaborate, learn more, or explore ideas together? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  className="h-12"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="h-12"
                />
              </div>

              {/* Meeting Interest */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Interested in setting up a virtual meeting?
                </Label>
                <RadioGroup defaultValue="no" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="meeting-yes" />
                    <Label htmlFor="meeting-yes" className="font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="meeting-no" />
                    <Label htmlFor="meeting-no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us what's on your mind..."
                  required
                  rows={5}
                  className="resize-none"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
