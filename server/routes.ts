import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve our static HTML files
  app.use('/attached_assets', express.static(path.resolve(process.cwd(), 'attached_assets')));

  // Serve static files (HTML, CSS, JS)
  app.use(express.static(process.cwd()));

  // Serve our main HTML file at /site route
  app.get('/site', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'index.html'));
  });

  // WhatsApp validation endpoint - moved to avoid Vite interception
  app.post("/api/validate-whatsapp", async (req, res) => {
    try {
      const { number } = req.body;
      
      if (!number) {
        return res.status(400).json({ 
          message: "Número é obrigatório" 
        });
      }

      const fullNumber = `55${number}`;
      
      const response = await fetch('https://evolutionapi.eduflow.com.br/chat/whatsappNumbers/havr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'C6E3CD01-3399-4BC3-A1E2-5A44B8D893FD'
        },
        body: JSON.stringify({
          numbers: [fullNumber]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        return res.status(500).json({ 
          message: "Erro ao validar número" 
        });
      }

      const data = await response.json();
      
      if (data && Array.isArray(data) && data.length > 0) {
        const numberInfo = data[0];
        res.json({ 
          valid: numberInfo.exists === true,
          data: numberInfo
        });
      } else {
        res.json({ 
          valid: false 
        });
      }
    } catch (error) {
      console.error('WhatsApp validation error:', error);
      res.status(500).json({ 
        message: "Erro interno do servidor" 
      });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ 
          message: "Todos os campos são obrigatórios" 
        });
      }

      // Here you would typically save to database or send email
      // For now, we'll just log the contact attempt
      console.log('Contact form submission:', { name, email, message });

      res.json({ 
        message: "Mensagem enviada com sucesso! Entraremos em contato em breve." 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ 
        message: "Erro interno do servidor. Tente novamente." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
