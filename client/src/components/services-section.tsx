import { Code, Smartphone, Bot, MessageSquare } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      icon: Code,
      title: "Sistemas Personalizados",
      description: "Automatize processos e tenha um sistema sob medida para suas necessidades específicas.",
    },
    {
      icon: Smartphone,
      title: "Aplicativos Mobile",
      description: "Aplicativos exclusivos para Android e iOS para ampliar sua presença digital.",
    },
    {
      icon: Bot,
      title: "IA no WhatsApp",
      description: "Atendimento inteligente e eficiente no WhatsApp, disponível 24 horas por dia.",
    },
    {
      icon: MessageSquare,
      title: "CRM com WhatsApp",
      description: "Centralize conversas e gerencie relacionamentos com seus clientes com facilidade.",
    },
  ];

  return (
    <section id="servicos" className="py-24" style={{ backgroundColor: '#ff0000' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16" data-testid="services-header">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4" data-testid="services-title">
            Nossos <span className="text-accent">Serviços</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto" data-testid="services-subtitle">
            Oferecemos soluções completas em tecnologia para impulsionar seu negócio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover-lift group"
              data-testid={`service-card-${index}`}
            >
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <service.icon className="w-8 h-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4" data-testid={`service-title-${index}`}>
                {service.title}
              </h3>
              <p className="text-white/70 leading-relaxed" data-testid={`service-description-${index}`}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
