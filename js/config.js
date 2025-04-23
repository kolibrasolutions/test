/**
 * Arquivo de configuração do site de agendamento
 * Este arquivo contém as configurações personalizáveis do site
 */

// Configurações do estabelecimento
const businessConfig = {
    // Informações básicas
    name: "Nome do Estabelecimento", // Nome do estabelecimento
    slogan: "Seu slogan aqui", // Slogan ou frase de efeito
    description: "Descrição curta do estabelecimento para a seção Sobre Nós",
    
    // Informações de contato
    address: "Rua Exemplo, 123 - Bairro - Cidade/UF",
    phone: "(00) 00000-0000",
    whatsapp: "5500000000000", // Formato internacional sem espaços ou caracteres especiais
    email: "contato@exemplo.com",
    
    // Horário de funcionamento
    businessHours: "Seg-Sex: 9h às 19h | Sáb: 9h às 16h",
    
    // Redes sociais (deixe em branco se não tiver)
    socialMedia: {
        instagram: "https://www.instagram.com/",
        facebook: "https://www.facebook.com/",
        tiktok: "",
        youtube: ""
    },
    
    // Localização para o mapa
    mapLocation: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.356219020248!2d-43.18618388503454!3d-22.90692998501355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f58a6a00a9d%3A0x3f251d85272f76f7!2sAv.%20Rio%20Branco%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1650000000000!5m2!1spt-BR!2sbr",
    
    // Informações legais
    cnpj: "00.000.000/0001-00",
    
    // Cores do tema (em formato hexadecimal)
    colors: {
        primary: "#004494", // Cor principal (azul)
        secondary: "#FF7F00", // Cor secundária (laranja)
        accent: "#28a745", // Cor de destaque (verde)
        dark: "#333333", // Cor escura
        light: "#ffffff" // Cor clara
    }
};

// Serviços oferecidos
const servicesConfig = [
    {
        id: 1,
        name: "Corte de Cabelo",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 35.00,
        duration: 30, // duração em minutos
        icon: "fas fa-cut" // ícone do Font Awesome
    },
    {
        id: 2,
        name: "Barba",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 25.00,
        duration: 20,
        icon: "fas fa-razor"
    },
    {
        id: 3,
        name: "Acabamento",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 15.00,
        duration: 15,
        icon: "fas fa-spray-can"
    },
    {
        id: 4,
        name: "Combo Completo",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 60.00,
        duration: 60,
        icon: "fas fa-magic"
    }
];

// Depoimentos de clientes
const testimonialsConfig = [
    {
        id: 1,
        name: "João Silva",
        image: "img/client1.jpg",
        text: "Excelente atendimento! Profissionais muito qualificados e ambiente super agradável. Recomendo a todos!",
        rating: 5 // de 1 a 5
    },
    {
        id: 2,
        name: "Maria Oliveira",
        image: "img/client2.jpg",
        text: "Sempre saio satisfeito! O sistema de agendamento online é muito prático e facilita muito a vida.",
        rating: 5
    },
    {
        id: 3,
        name: "Pedro Santos",
        image: "img/client3.jpg",
        text: "Atendimento de primeira qualidade! Ambiente limpo e organizado. Recomendo fortemente!",
        rating: 4.5
    }
];

// Configurações do sistema de agendamento
const bookingConfig = {
    // Horário de funcionamento para agendamentos
    workingHours: {
        start: "09:00", // Horário de início
        end: "19:00", // Horário de término
        interval: 30, // Intervalo entre agendamentos em minutos
        lunchStart: "12:30", // Início do horário de almoço
        lunchEnd: "13:30" // Fim do horário de almoço
    },
    
    // Dias da semana disponíveis para agendamento (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
    workingDays: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
    
    // Número máximo de dias no futuro para agendamento
    maxDaysInAdvance: 30,
    
    // Tempo mínimo de antecedência para agendamento (em horas)
    minTimeInAdvance: 1,
    
    // Configurações de notificação
    notifications: {
        email: true, // Enviar confirmação por e-mail
        reminder: true, // Enviar lembrete antes do agendamento
        reminderHours: 24 // Horas antes para enviar o lembrete
    }
};

// Configurações do Google Calendar (para integração)
const googleCalendarConfig = {
    // Ativar integração com Google Calendar
    enabled: true,
    
    // ID do calendário do Google
    calendarId: "primary",
    
    // Chave de API (será configurada pelo proprietário)
    apiKey: "",
    
    // ID do cliente OAuth (já configurado com suas credenciais)
    clientId: "517220858606-fsdpi7f482j7nqsqeq4sc79cifa15v3j.apps.googleusercontent.com",
    
    // Segredo do cliente (opcional, usado apenas em alguns casos)
    clientSecret: "GOCSFX-WSYULOJMixfgP1yj_Vj0r4yLwz8G",
    
    // Escopos de acesso necessários
    scopes: "https://www.googleapis.com/auth/calendar"
};

// Não modifique abaixo desta linha
// Exportando as configurações para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        businessConfig,
        servicesConfig,
        testimonialsConfig,
        bookingConfig,
        googleCalendarConfig
    };
}
