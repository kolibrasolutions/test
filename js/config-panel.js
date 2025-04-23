/**
 * Arquivo JavaScript para o painel de configuração
 * Permite personalizar facilmente o site de agendamento
 */

// Aguardar o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o painel de configuração
    initConfigPanel();
});

/**
 * Inicializa o painel de configuração
 */
function initConfigPanel() {
    // Verificar se estamos na página de configuração
    if (!document.getElementById('config-panel')) return;
    
    // Carregar configurações atuais
    loadCurrentConfig();
    
    // Configurar eventos de formulário
    setupFormEvents();
    
    // Configurar upload de imagens
    setupImageUpload();
    
    // Configurar visualização em tempo real
    setupLivePreview();
    
    console.log('Painel de configuração inicializado com sucesso!');
}

/**
 * Carrega as configurações atuais no formulário
 */
function loadCurrentConfig() {
    // Informações básicas
    document.getElementById('business-name').value = businessConfig.name;
    document.getElementById('business-slogan').value = businessConfig.slogan;
    document.getElementById('business-description').value = businessConfig.description;
    
    // Informações de contato
    document.getElementById('business-address').value = businessConfig.address;
    document.getElementById('business-phone').value = businessConfig.phone;
    document.getElementById('business-whatsapp').value = businessConfig.whatsapp;
    document.getElementById('business-email').value = businessConfig.email;
    document.getElementById('business-hours').value = businessConfig.businessHours;
    
    // Redes sociais
    document.getElementById('social-instagram').value = businessConfig.socialMedia.instagram;
    document.getElementById('social-facebook').value = businessConfig.socialMedia.facebook;
    document.getElementById('social-tiktok').value = businessConfig.socialMedia.tiktok;
    document.getElementById('social-youtube').value = businessConfig.socialMedia.youtube;
    
    // Localização para o mapa
    document.getElementById('map-location').value = businessConfig.mapLocation;
    
    // Informações legais
    document.getElementById('business-cnpj').value = businessConfig.cnpj;
    
    // Cores do tema
    document.getElementById('primary-color').value = businessConfig.colors.primary;
    document.getElementById('secondary-color').value = businessConfig.colors.secondary;
    document.getElementById('accent-color').value = businessConfig.colors.accent;
    document.getElementById('dark-color').value = businessConfig.colors.dark;
    document.getElementById('light-color').value = businessConfig.colors.light;
    
    // Carregar serviços
    loadServices();
    
    // Carregar depoimentos
    loadTestimonials();
    
    // Carregar configurações de agendamento
    loadBookingConfig();
    
    // Carregar configurações do Google Calendar
    loadGoogleCalendarConfig();
}

/**
 * Carrega os serviços no formulário
 */
function loadServices() {
    const servicesContainer = document.getElementById('services-container');
    
    if (!servicesContainer) return;
    
    // Limpar o conteúdo existente
    servicesContainer.innerHTML = '';
    
    // Adicionar cada serviço
    servicesConfig.forEach((service, index) => {
        const serviceItem = createServiceItem(service, index);
        servicesContainer.appendChild(serviceItem);
    });
    
    // Adicionar botão para novo serviço
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn btn-primary add-service-btn';
    addButton.innerHTML = '<i class="fas fa-plus"></i> Adicionar Serviço';
    addButton.addEventListener('click', addNewService);
    
    servicesContainer.appendChild(addButton);
}

/**
 * Cria um item de serviço para o formulário
 * @param {Object} service - Dados do serviço
 * @param {number} index - Índice do serviço
 * @returns {HTMLElement} - Elemento HTML do serviço
 */
function createServiceItem(service, index) {
    const serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';
    serviceItem.dataset.index = index;
    
    serviceItem.innerHTML = `
        <div class="service-header">
            <h4>Serviço #${index + 1}</h4>
            <button type="button" class="btn-remove" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="form-group">
            <label for="service-name-${index}">Nome do Serviço</label>
            <input type="text" id="service-name-${index}" name="service-name-${index}" value="${service.name}" required>
        </div>
        <div class="form-group">
            <label for="service-description-${index}">Descrição</label>
            <textarea id="service-description-${index}" name="service-description-${index}" rows="2" required>${service.description}</textarea>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="service-price-${index}">Preço (R$)</label>
                <input type="number" id="service-price-${index}" name="service-price-${index}" value="${service.price}" step="0.01" min="0" required>
            </div>
            <div class="form-group">
                <label for="service-duration-${index}">Duração (min)</label>
                <input type="number" id="service-duration-${index}" name="service-duration-${index}" value="${service.duration}" min="5" step="5" required>
            </div>
            <div class="form-group">
                <label for="service-icon-${index}">Ícone</label>
                <input type="text" id="service-icon-${index}" name="service-icon-${index}" value="${service.icon}" required>
                <small>Classe do Font Awesome (ex: fas fa-cut)</small>
            </div>
        </div>
    `;
    
    // Adicionar evento para remover serviço
    const removeButton = serviceItem.querySelector('.btn-remove');
    removeButton.addEventListener('click', function() {
        removeService(index);
    });
    
    return serviceItem;
}

/**
 * Adiciona um novo serviço
 */
function addNewService() {
    // Criar novo serviço
    const newService = {
        id: servicesConfig.length + 1,
        name: 'Novo Serviço',
        description: 'Descrição do serviço',
        price: 0.00,
        duration: 30,
        icon: 'fas fa-star'
    };
    
    // Adicionar à lista de serviços
    servicesConfig.push(newService);
    
    // Recarregar serviços
    loadServices();
    
    // Atualizar visualização
    updateLivePreview();
}

/**
 * Remove um serviço
 * @param {number} index - Índice do serviço a ser removido
 */
function removeService(index) {
    // Confirmar remoção
    if (confirm('Tem certeza que deseja remover este serviço?')) {
        // Remover da lista de serviços
        servicesConfig.splice(index, 1);
        
        // Recarregar serviços
        loadServices();
        
        // Atualizar visualização
        updateLivePreview();
    }
}

/**
 * Carrega os depoimentos no formulário
 */
function loadTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    
    if (!testimonialsContainer) return;
    
    // Limpar o conteúdo existente
    testimonialsContainer.innerHTML = '';
    
    // Adicionar cada depoimento
    testimonialsConfig.forEach((testimonial, index) => {
        const testimonialItem = createTestimonialItem(testimonial, index);
        testimonialsContainer.appendChild(testimonialItem);
    });
    
    // Adicionar botão para novo depoimento
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn btn-primary add-testimonial-btn';
    addButton.innerHTML = '<i class="fas fa-plus"></i> Adicionar Depoimento';
    addButton.addEventListener('click', addNewTestimonial);
    
    testimonialsContainer.appendChild(addButton);
}

/**
 * Cria um item de depoimento para o formulário
 * @param {Object} testimonial - Dados do depoimento
 * @param {number} index - Índice do depoimento
 * @returns {HTMLElement} - Elemento HTML do depoimento
 */
function createTestimonialItem(testimonial, index) {
    const testimonialItem = document.createElement('div');
    testimonialItem.className = 'testimonial-item';
    testimonialItem.dataset.index = index;
    
    testimonialItem.innerHTML = `
        <div class="testimonial-header">
            <h4>Depoimento #${index + 1}</h4>
            <button type="button" class="btn-remove" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="form-group">
            <label for="testimonial-name-${index}">Nome do Cliente</label>
            <input type="text" id="testimonial-name-${index}" name="testimonial-name-${index}" value="${testimonial.name}" required>
        </div>
        <div class="form-group">
            <label for="testimonial-text-${index}">Depoimento</label>
            <textarea id="testimonial-text-${index}" name="testimonial-text-${index}" rows="3" required>${testimonial.text}</textarea>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="testimonial-image-${index}">Imagem</label>
                <div class="image-upload-container">
                    <input type="file" id="testimonial-image-upload-${index}" class="image-upload" data-target="testimonial-image-${index}" accept="image/*">
                    <input type="text" id="testimonial-image-${index}" name="testimonial-image-${index}" value="${testimonial.image}" required>
                    <button type="button" class="btn-upload" data-for="testimonial-image-upload-${index}">Escolher</button>
                </div>
                <div class="image-preview">
                    <img src="${testimonial.image}" alt="${testimonial.name}" id="testimonial-image-preview-${index}">
                </div>
            </div>
            <div class="form-group">
                <label for="testimonial-rating-${index}">Avaliação</label>
                <input type="number" id="testimonial-rating-${index}" name="testimonial-rating-${index}" value="${testimonial.rating}" min="1" max="5" step="0.5" required>
                <small>De 1 a 5 estrelas</small>
            </div>
        </div>
    `;
    
    // Adicionar evento para remover depoimento
    const removeButton = testimonialItem.querySelector('.btn-remove');
    removeButton.addEventListener('click', function() {
        removeTestimonial(index);
    });
    
    return testimonialItem;
}

/**
 * Adiciona um novo depoimento
 */
function addNewTestimonial() {
    // Criar novo depoimento
    const newTestimonial = {
        id: testimonialsConfig.length + 1,
        name: 'Nome do Cliente',
        image: 'img/client-default.jpg',
        text: 'Depoimento do cliente sobre o serviço.',
        rating: 5
    };
    
    // Adicionar à lista de depoimentos
    testimonialsConfig.push(newTestimonial);
    
    // Recarregar depoimentos
    loadTestimonials();
    
    // Atualizar visualização
    updateLivePreview();
}

/**
 * Remove um depoimento
 * @param {number} index - Índice do depoimento a ser removido
 */
function removeTestimonial(index) {
    // Confirmar remoção
    if (confirm('Tem certeza que deseja remover este depoimento?')) {
        // Remover da lista de depoimentos
        testimonialsConfig.splice(index, 1);
        
        // Recarregar depoimentos
        loadTestimonials();
        
        // Atualizar visualização
        updateLivePreview();
    }
}

/**
 * Carrega as configurações de agendamento no formulário
 */
function loadBookingConfig() {
    // Horário de funcionamento
    document.getElementById('working-hours-start').value = bookingConfig.workingHours.start;
    document.getElementById('working-hours-end').value = bookingConfig.workingHours.end;
    document.getElementById('working-hours-interval').value = bookingConfig.workingHours.interval;
    document.getElementById('working-hours-lunch-start').value = bookingConfig.workingHours.lunchStart;
    document.getElementById('working-hours-lunch-end').value = bookingConfig.workingHours.lunchEnd;
    
    // Dias da semana
    const workingDays = bookingConfig.workingDays;
    document.getElementById('working-day-0').checked = workingDays.includes(0);
    document.getElementById('working-day-1').checked = workingDays.includes(1);
    document.getElementById('working-day-2').checked = workingDays.includes(2);
    document.getElementById('working-day-3').checked = workingDays.includes(3);
    document.getElementById('working-day-4').checked = workingDays.includes(4);
    document.getElementById('working-day-5').checked = workingDays.includes(5);
    document.getElementById('working-day-6').checked = workingDays.includes(6);
    
    // Outras configurações
    document.getElementById('max-days-advance').value = bookingConfig.maxDaysInAdvance;
    document.getElementById('min-time-advance').value = bookingConfig.minTimeInAdvance;
    
    // Notificações
    document.getElementById('notification-email').checked = bookingConfig.notifications.email;
    document.getElementById('notification-reminder').checked = bookingConfig.notifications.reminder;
    document.getElementById('notification-reminder-hours').value = bookingConfig.notifications.reminderHours;
}

/**
 * Carrega as configurações do Google Calendar no formulário
 */
function loadGoogleCalendarConfig() {
    document.getElementById('google-calendar-enabled').checked = googleCalendarConfig.enabled;
    document.getElementById('google-calendar-id').value = googleCalendarConfig.calendarId;
    document.getElementById('google-calendar-api-key').value = googleCalendarConfig.apiKey;
    document.getElementById('google-calendar-client-id').value = googleCalendarConfig.clientId;
}

/**
 * Configura eventos do formulário
 */
function setupFormEvents() {
    // Formulário principal
    const configForm = document.getElementById('config-form');
    
    if (configForm) {
        configForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveConfig();
        });
    }
    
    // Eventos de mudança para atualização em tempo real
    const inputElements = document.querySelectorAll('#config-form input, #config-form textarea, #config-form select');
    inputElements.forEach(input => {
        input.addEventListener('change', updateLivePreview);
        input.addEventListener('input', debounce(updateLivePreview, 500));
    });
    
    // Botão de restaurar padrões
    const resetButton = document.getElementById('reset-config');
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Tem certeza que deseja restaurar todas as configurações para os valores padrão? Esta ação não pode ser desfeita.')) {
                resetConfig();
            }
        });
    }
}

/**
 * Configura upload de imagens
 */
function setupImageUpload() {
    // Botões de upload
    const uploadButtons = document.querySelectorAll('.btn-upload');
    uploadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inputId = this.dataset.for;
            document.getElementById(inputId).click();
        });
    });
    
    // Inputs de arquivo
    const fileInputs = document.querySelectorAll('.image-upload');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const targetId = this.dataset.target;
                const targetInput = document.getElementById(targetId);
                const previewId = targetId + '-preview';
                const previewImg = document.getElementById(previewId);
                
                // Simular upload (em uma implementação real, isso enviaria para o servidor)
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Atualizar caminho da imagem (simulado)
                    const fileName = input.files[0].name;
                    targetInput.value = 'img/' + fileName;
                    
                    // Atualizar preview
                    if (previewImg) {
                        previewImg.src = e.target.result;
                    }
                    
                    // Atualizar visualização
                    updateLivePreview();
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
}

/**
 * Configura visualização em tempo real
 */
function setupLivePreview() {
    // Botão de visualizar
    const previewButton = document.getElementById('preview-config');
    if (previewButton) {
        previewButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Abrir visualização em nova aba
            const previewWindow = window.open('index.html', '_blank');
            
            // Atualizar configurações temporariamente
            updateConfigFromForm();
            
            // Passar configurações para a nova aba
            previewWindow.addEventListener('load', function() {
                previewWindow.businessConfig = businessConfig;
                previewWindow.servicesConfig = servicesConfig;
                previewWindow.testimonialsConfig = testimonialsConfig;
                previewWindow.bookingConfig = bookingConfig;
                previewWindow.googleCalendarConfig = googleCalendarConfig;
                
                // Recarregar a página para aplicar as configurações
                previewWindow.location.reload();
            });
        });
    }
}

/**
 * Atualiza a visualização em tempo real
 */
function updateLivePreview() {
    // Atualizar configurações
    updateConfigFromForm();
    
    // Atualizar elementos na página atual (se estiver no modo de edição)
    if (document.getElementById('config-panel')) {
        // Atualizar cores
        updateThemeColors();
        
        // Atualizar previews de serviços
        updateServicePreviews();
        
        // Atualizar previews de depoimentos
        updateTestimonialPreviews();
    }
}

/**
 * Atualiza as cores do tema
 */
function updateThemeColors() {
    const primaryColor = document.getElementById('primary-color').value;
    const secondaryColor = document.getElementById('secondary-color').value;
    const accentColor = document.getElementById('accent-color').value;
    
    // Atualizar variáveis CSS
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--success-color', accentColor);
}

/**
 * Atualiza as previews de serviços
 */
function updateServicePreviews() {
    const servicePreviewContainer = document.getElementById('service-previews');
    
    if (!servicePreviewContainer) return;
    
    // Limpar o conteúdo existente
    servicePreviewContainer.innerHTML = '';
    
    // Adicionar cada serviço
    servicesConfig.forEach(service => {
        const servicePreview = document.createElement('div');
        servicePreview.className = 'service-preview';
        
        servicePreview.innerHTML = `
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <div class="service-price">R$ ${service.price.toFixed(2)}</div>
        `;
        
        servicePreviewContainer.appendChild(servicePreview);
    });
}

/**
 * Atualiza as previews de depoimentos
 */
function updateTestimonialPreviews() {
    const testimonialPreviewContainer = document.getElementById('testimonial-previews');
    
    if (!testimonialPreviewContainer) return;
    
    // Limpar o conteúdo existente
    testimonialPreviewContainer.innerHTML = '';
    
    // Adicionar cada depoimento
    testimonialsConfig.forEach(testimonial => {
        const testimonialPreview = document.createElement('div');
        testimonialPreview.className = 'testimonial-preview';
        
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
        
        testimonialPreview.innerHTML = `
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
        
        testimonialPreviewContainer.appendChild(testimonialPreview);
    });
}

/**
 * Atualiza as configurações a partir do formulário
 */
function updateConfigFromForm() {
    // Informações básicas
    businessConfig.name = document.getElementById('business-name').value;
    businessConfig.slogan = document.getElementById('business-slogan').value;
    businessConfig.description = document.getElementById('business-description').value;
    
    // Informações de contato
    businessConfig.address = document.getElementById('business-address').value;
    businessConfig.phone = document.getElementById('business-phone').value;
    businessConfig.whatsapp = document.getElementById('business-whatsapp').value;
    businessConfig.email = document.getElementById('business-email').value;
    businessConfig.businessHours = document.getElementById('business-hours').value;
    
    // Redes sociais
    businessConfig.socialMedia.instagram = document.getElementById('social-instagram').value;
    businessConfig.socialMedia.facebook = document.getElementById('social-facebook').value;
    businessConfig.socialMedia.tiktok = document.getElementById('social-tiktok').value;
    businessConfig.socialMedia.youtube = document.getElementById('social-youtube').value;
    
    // Localização para o mapa
    businessConfig.mapLocation = document.getElementById('map-location').value;
    
    // Informações legais
    businessConfig.cnpj = document.getElementById('business-cnpj').value;
    
    // Cores do tema
    businessConfig.colors.primary = document.getElementById('primary-color').value;
    businessConfig.colors.secondary = document.getElementById('secondary-color').value;
    businessConfig.colors.accent = document.getElementById('accent-color').value;
    businessConfig.colors.dark = document.getElementById('dark-color').value;
    businessConfig.colors.light = document.getElementById('light-color').value;
    
    // Atualizar serviços
    updateServicesFromForm();
    
    // Atualizar depoimentos
    updateTestimonialsFromForm();
    
    // Atualizar configurações de agendamento
    updateBookingConfigFromForm();
    
    // Atualizar configurações do Google Calendar
    updateGoogleCalendarConfigFromForm();
}

/**
 * Atualiza os serviços a partir do formulário
 */
function updateServicesFromForm() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    // Criar nova lista de serviços
    const updatedServices = [];
    
    serviceItems.forEach((item, index) => {
        const serviceId = index + 1;
        const serviceName = document.getElementById(`service-name-${index}`).value;
        const serviceDescription = document.getElementById(`service-description-${index}`).value;
        const servicePrice = parseFloat(document.getElementById(`service-price-${index}`).value);
        const serviceDuration = parseInt(document.getElementById(`service-duration-${index}`).value);
        const serviceIcon = document.getElementById(`service-icon-${index}`).value;
        
        updatedServices.push({
            id: serviceId,
            name: serviceName,
            description: serviceDescription,
            price: servicePrice,
            duration: serviceDuration,
            icon: serviceIcon
        });
    });
    
    // Atualizar lista de serviços
    servicesConfig = updatedServices;
}

/**
 * Atualiza os depoimentos a partir do formulário
 */
function updateTestimonialsFromForm() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    
    // Criar nova lista de depoimentos
    const updatedTestimonials = [];
    
    testimonialItems.forEach((item, index) => {
        const testimonialId = index + 1;
        const testimonialName = document.getElementById(`testimonial-name-${index}`).value;
        const testimonialText = document.getElementById(`testimonial-text-${index}`).value;
        const testimonialImage = document.getElementById(`testimonial-image-${index}`).value;
        const testimonialRating = parseFloat(document.getElementById(`testimonial-rating-${index}`).value);
        
        updatedTestimonials.push({
            id: testimonialId,
            name: testimonialName,
            image: testimonialImage,
            text: testimonialText,
            rating: testimonialRating
        });
    });
    
    // Atualizar lista de depoimentos
    testimonialsConfig = updatedTestimonials;
}

/**
 * Atualiza as configurações de agendamento a partir do formulário
 */
function updateBookingConfigFromForm() {
    // Horário de funcionamento
    bookingConfig.workingHours.start = document.getElementById('working-hours-start').value;
    bookingConfig.workingHours.end = document.getElementById('working-hours-end').value;
    bookingConfig.workingHours.interval = parseInt(document.getElementById('working-hours-interval').value);
    bookingConfig.workingHours.lunchStart = document.getElementById('working-hours-lunch-start').value;
    bookingConfig.workingHours.lunchEnd = document.getElementById('working-hours-lunch-end').value;
    
    // Dias da semana
    const workingDays = [];
    if (document.getElementById('working-day-0').checked) workingDays.push(0);
    if (document.getElementById('working-day-1').checked) workingDays.push(1);
    if (document.getElementById('working-day-2').checked) workingDays.push(2);
    if (document.getElementById('working-day-3').checked) workingDays.push(3);
    if (document.getElementById('working-day-4').checked) workingDays.push(4);
    if (document.getElementById('working-day-5').checked) workingDays.push(5);
    if (document.getElementById('working-day-6').checked) workingDays.push(6);
    
    bookingConfig.workingDays = workingDays;
    
    // Outras configurações
    bookingConfig.maxDaysInAdvance = parseInt(document.getElementById('max-days-advance').value);
    bookingConfig.minTimeInAdvance = parseInt(document.getElementById('min-time-advance').value);
    
    // Notificações
    bookingConfig.notifications.email = document.getElementById('notification-email').checked;
    bookingConfig.notifications.reminder = document.getElementById('notification-reminder').checked;
    bookingConfig.notifications.reminderHours = parseInt(document.getElementById('notification-reminder-hours').value);
}

/**
 * Atualiza as configurações do Google Calendar a partir do formulário
 */
function updateGoogleCalendarConfigFromForm() {
    googleCalendarConfig.enabled = document.getElementById('google-calendar-enabled').checked;
    googleCalendarConfig.calendarId = document.getElementById('google-calendar-id').value;
    googleCalendarConfig.apiKey = document.getElementById('google-calendar-api-key').value;
    googleCalendarConfig.clientId = document.getElementById('google-calendar-client-id').value;
}

/**
 * Salva as configurações
 */
function saveConfig() {
    // Atualizar configurações a partir do formulário
    updateConfigFromForm();
    
    // Gerar arquivo de configuração
    const configContent = generateConfigFile();
    
    // Fazer download do arquivo
    downloadConfigFile(configContent);
    
    // Mostrar mensagem de sucesso
    alert('Configurações salvas com sucesso! O arquivo de configuração foi baixado.');
}

/**
 * Gera o conteúdo do arquivo de configuração
 * @returns {string} - Conteúdo do arquivo de configuração
 */
function generateConfigFile() {
    return `/**
 * Arquivo de configuração do site de agendamento
 * Este arquivo contém as configurações personalizáveis do site
 */

// Configurações do estabelecimento
const businessConfig = ${JSON.stringify(businessConfig, null, 4)};

// Serviços oferecidos
const servicesConfig = ${JSON.stringify(servicesConfig, null, 4)};

// Depoimentos de clientes
const testimonialsConfig = ${JSON.stringify(testimonialsConfig, null, 4)};

// Configurações do sistema de agendamento
const bookingConfig = ${JSON.stringify(bookingConfig, null, 4)};

// Configurações do Google Calendar (para integração)
const googleCalendarConfig = ${JSON.stringify(googleCalendarConfig, null, 4)};

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
}`;
}

/**
 * Faz o download do arquivo de configuração
 * @param {string} content - Conteúdo do arquivo
 */
function downloadConfigFile(content) {
    const blob = new Blob([content], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'config.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Restaura as configurações padrão
 */
function resetConfig() {
    // Recarregar a página para restaurar as configurações padrão
    location.reload();
}

/**
 * Função para limitar a frequência de execução de uma função
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em milissegundos
 * @returns {Function} - Função com limite de frequência
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}
