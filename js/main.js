/**
 * Arquivo principal de JavaScript para o site de agendamento
 * Responsável pela inicialização e funcionalidades gerais
 */

// Aguardar o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar a aplicação
    initApp();
    
    // Configurar eventos de navegação
    setupNavigation();
    
    // Carregar dados dinâmicos
    loadDynamicContent();
});

/**
 * Inicializa a aplicação
 */
function initApp() {
    // Atualizar o ano atual no rodapé
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Aplicar configurações do estabelecimento
    applyBusinessConfig();
    
    // Verificar se o usuário está em um dispositivo móvel
    checkMobileDevice();
    
    console.log('Aplicação inicializada com sucesso!');
}

/**
 * Aplica as configurações do estabelecimento ao site
 */
function applyBusinessConfig() {
    // Atualizar nome do estabelecimento
    const businessNameElements = document.querySelectorAll('.business-name');
    businessNameElements.forEach(element => {
        element.textContent = businessConfig.name;
    });
    
    // Atualizar informações de contato
    document.getElementById('business-address').textContent = businessConfig.address;
    document.getElementById('business-phone').textContent = businessConfig.phone;
    document.getElementById('business-hours').textContent = businessConfig.businessHours;
    
    document.getElementById('contact-address').textContent = businessConfig.address;
    document.getElementById('contact-phone').textContent = businessConfig.phone;
    document.getElementById('contact-email').textContent = businessConfig.email;
    document.getElementById('contact-hours').textContent = businessConfig.businessHours;
    
    document.getElementById('footer-address').textContent = businessConfig.address;
    document.getElementById('footer-phone').textContent = businessConfig.phone;
    document.getElementById('footer-email').textContent = businessConfig.email;
    
    document.getElementById('business-name-footer').textContent = businessConfig.name;
    document.getElementById('business-cnpj').textContent = businessConfig.cnpj;
    
    // Configurar links de redes sociais
    if (businessConfig.socialMedia.instagram) {
        document.getElementById('social-instagram').href = businessConfig.socialMedia.instagram;
    }
    
    if (businessConfig.socialMedia.facebook) {
        document.getElementById('social-facebook').href = businessConfig.socialMedia.facebook;
    }
    
    if (businessConfig.socialMedia.whatsapp) {
        document.getElementById('social-whatsapp').href = `https://wa.me/${businessConfig.whatsapp}`;
    }
    
    // Configurar mapa do Google
    document.getElementById('google-map').src = businessConfig.mapLocation;
    
    // Aplicar cores do tema
    applyThemeColors();
}

/**
 * Aplica as cores do tema definidas na configuração
 */
function applyThemeColors() {
    // Criar uma folha de estilo dinâmica
    const style = document.createElement('style');
    
    // Definir as variáveis CSS com as cores do tema
    const css = `
        :root {
            --primary-color: ${businessConfig.colors.primary};
            --secondary-color: ${businessConfig.colors.secondary};
            --success-color: ${businessConfig.colors.accent};
            --dark-color: ${businessConfig.colors.dark};
            --light-color: ${businessConfig.colors.light};
        }
    `;
    
    style.textContent = css;
    document.head.appendChild(style);
}

/**
 * Configura eventos de navegação e interação
 */
function setupNavigation() {
    // Menu mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Rolagem suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Modal de agendamento bem-sucedido
    const modal = document.getElementById('booking-success-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * Carrega conteúdo dinâmico nas seções do site
 */
function loadDynamicContent() {
    // Carregar serviços
    loadServices();
    
    // Carregar depoimentos
    loadTestimonials();
    
    // Carregar serviços no rodapé
    loadFooterServices();
}

/**
 * Carrega os serviços na seção de serviços
 */
function loadServices() {
    const servicesContainer = document.getElementById('services-container');
    
    if (!servicesContainer) return;
    
    // Limpar o conteúdo existente
    servicesContainer.innerHTML = '';
    
    // Adicionar cada serviço
    servicesConfig.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        
        serviceCard.innerHTML = `
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <div class="service-price">R$ ${service.price.toFixed(2)}</div>
            <a href="#agendar" class="btn btn-sm btn-outline">Agendar</a>
        `;
        
        servicesContainer.appendChild(serviceCard);
    });
}

/**
 * Carrega os depoimentos na seção de depoimentos
 */
function loadTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    
    if (!testimonialsContainer) return;
    
    // Limpar o conteúdo existente
    testimonialsContainer.innerHTML = '';
    
    // Adicionar cada depoimento
    testimonialsConfig.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        
        // Gerar as estrelas com base na avaliação
        let stars = '';
        const fullStars = Math.floor(testimonial.rating);
        const hasHalfStar = testimonial.rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(testimonial.rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        testimonialCard.innerHTML = `
            <div class="testimonial-content">
                <p>"${testimonial.text}"</p>
            </div>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.name}" class="author-image">
                <div class="author-info">
                    <h4>${testimonial.name}</h4>
                    <div class="rating">
                        ${stars}
                    </div>
                </div>
            </div>
        `;
        
        testimonialsContainer.appendChild(testimonialCard);
    });
}

/**
 * Carrega os serviços no rodapé
 */
function loadFooterServices() {
    const footerServices = document.getElementById('footer-services');
    
    if (!footerServices) return;
    
    // Limpar o conteúdo existente
    footerServices.innerHTML = '';
    
    // Adicionar cada serviço
    servicesConfig.forEach(service => {
        const serviceItem = document.createElement('li');
        serviceItem.innerHTML = `<a href="#agendar">${service.name}</a>`;
        footerServices.appendChild(serviceItem);
    });
}

/**
 * Verifica se o usuário está em um dispositivo móvel
 */
function checkMobileDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
}

/**
 * Exibe uma mensagem de notificação para o usuário
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de notificação (success, error, warning, info)
 * @param {number} duration - Duração em milissegundos
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Adicionar ao corpo do documento
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remover após a duração especificada
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Remover do DOM após a animação
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

/**
 * Formata um valor monetário
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda
 */
function formatCurrency(value) {
    return `R$ ${value.toFixed(2)}`;
}

/**
 * Formata uma data
 * @param {Date} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
function formatDate(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Formata um horário
 * @param {string} time - Horário no formato HH:MM
 * @returns {string} - Horário formatado
 */
function formatTime(time) {
    return time;
}
