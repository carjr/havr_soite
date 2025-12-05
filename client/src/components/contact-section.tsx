import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Clock } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Entraremos em contato em breve.",
      });
      
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-24 bg-[#0a0f1a]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16" data-testid="contact-header">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4" data-testid="contact-title">
            Entre em <span className="text-accent">Contato</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto" data-testid="contact-subtitle">
            Vamos conversar sobre como podemos impulsionar seu negócio com tecnologia
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10" data-testid="contact-form">
            <h3 className="text-2xl font-semibold text-white mb-6">Envie sua mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-white mb-2">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  data-testid="input-name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-white mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  data-testid="input-email"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-white mb-2">
                  Mensagem
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full resize-none bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  data-testid="input-message"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white hover:bg-primary/90"
                data-testid="button-submit-form"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10" data-testid="contact-info">
              <h3 className="text-2xl font-semibold text-white mb-6">Ou fale diretamente conosco</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">WhatsApp</h4>
                    <p className="text-white/70">Atendimento imediato via IA</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Mail className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Email</h4>
                    <p className="text-white/70">contato@havrtecnologia.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Clock className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Horário</h4>
                    <p className="text-white/70">24/7 com IA - Segunda à Sexta 8h às 18h</p>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/5517992331492"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                data-testid="button-whatsapp-contact"
              >
                <MessageSquare />
                <span>Falar no WhatsApp</span>
              </a>
            </div>

            {/* CTA Card */}
            <div className="gradient-bg p-8 rounded-2xl text-white" data-testid="contact-cta">
              <h3 className="text-2xl font-bold mb-4">Pronto para inovar?</h3>
              <p className="mb-6 opacity-90">
                Transforme seu negócio com nossas soluções personalizadas. Solicite uma demonstração gratuita.
              </p>
              <a
                href="https://wa.me/5517992331492"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  className="bg-white text-primary hover:bg-white/90"
                  data-testid="button-demo-free"
                >
                  Demonstração Gratuita
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
