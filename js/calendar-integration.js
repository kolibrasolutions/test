/**
 * Arquivo JavaScript para integração com o Google Calendar
 * Responsável pela sincronização de agendamentos com o Google Calendar
 */

// Variáveis para controle da API do Google
let googleApiLoaded = false;
let googleApiInitialized = false;
let googleAuth = null;

// Aguardar o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se a integração com Google Calendar está habilitada
    if (googleCalendarConfig.enabled) {
        // Inicializar a API do Google
        initGoogleApi();
    }
});

/**
 * Inicializa a API do Google
 */
function initGoogleApi() {
    // Verificar se a API já foi carregada
    if (typeof gapi !== 'undefined') {
        // Carregar a biblioteca de cliente
        gapi.load('client:auth2', initGoogleClient);
        console.log('Carregando API do Google...');
    } else {
        console.warn('API do Google não encontrada. Verifique se o script foi carregado corretamente.');
    }
}

/**
 * Inicializa o cliente da API do Google
 */
function initGoogleClient() {
    // Inicializar o cliente com a chave de API
    gapi.client.init({
        apiKey: googleCalendarConfig.apiKey,
        clientId: googleCalendarConfig.clientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: googleCalendarConfig.scopes
    }).then(() => {
        // API inicializada com sucesso
        googleApiInitialized = true;
        
        // Obter instância de autenticação
        googleAuth = gapi.auth2.getAuthInstance();
        
        // Verificar se o usuário já está autenticado
        updateSigninStatus(googleAuth.isSignedIn.get());
        
        // Adicionar listener para mudanças no status de autenticação
        googleAuth.isSignedIn.listen(updateSigninStatus);
        
        console.log('API do Google inicializada com sucesso!');
    }).catch(error => {
        console.error('Erro ao inicializar API do Google:', error);
    });
}

/**
 * Atualiza o status de autenticação
 * @param {boolean} isSignedIn - Indica se o usuário está autenticado
 */
function updateSigninStatus(isSignedIn) {
    console.log('Status de autenticação do Google:', isSignedIn ? 'Autenticado' : 'Não autenticado');
    
    // Atualizar interface com base no status de autenticação
    const addToCalendarBtn = document.getElementById('btn-add-calendar');
    
    if (addToCalendarBtn) {
        if (isSignedIn) {
            addToCalendarBtn.textContent = 'Adicionar ao Google Calendar';
        } else {
            addToCalendarBtn.textContent = 'Conectar ao Google Calendar';
        }
    }
}

/**
 * Autentica o usuário no Google
 */
function authenticateWithGoogle() {
    // Verificar se a API foi inicializada
    if (!googleApiInitialized) {
        console.warn('API do Google não inicializada. Tentando inicializar...');
        initGoogleApi();
        return;
    }
    
    // Verificar se o usuário já está autenticado
    if (googleAuth.isSignedIn.get()) {
        console.log('Usuário já autenticado no Google.');
        return true;
    }
    
    // Solicitar autenticação
    try {
        googleAuth.signIn();
        return true;
    } catch (error) {
        console.error('Erro ao autenticar no Google:', error);
        return false;
    }
}

/**
 * Adiciona um evento ao Google Calendar
 * @param {Object} event - Dados do evento
 */
function addEventToGoogleCalendar(event) {
    // Verificar se a API foi inicializada
    if (!googleApiInitialized) {
        console.warn('API do Google não inicializada. Tentando inicializar...');
        initGoogleApi();
        showNotification('Erro ao conectar com o Google Calendar. Tente novamente.', 'error');
        return;
    }
    
    // Verificar se o usuário está autenticado
    if (!googleAuth.isSignedIn.get()) {
        // Solicitar autenticação
        googleAuth.signIn().then(() => {
            // Autenticação bem-sucedida, adicionar evento
            createCalendarEvent(event);
        }).catch(error => {
            console.error('Erro ao autenticar no Google:', error);
            showNotification('Erro ao conectar com o Google Calendar. Tente novamente.', 'error');
        });
    } else {
        // Usuário já autenticado, adicionar evento
        createCalendarEvent(event);
    }
}

/**
 * Cria um evento no Google Calendar
 * @param {Object} event - Dados do evento
 */
function createCalendarEvent(event) {
    // Verificar se a API do cliente foi carregada
    if (!gapi.client.calendar) {
        gapi.client.load('calendar', 'v3', () => {
            insertCalendarEvent(event);
        });
    } else {
        insertCalendarEvent(event);
    }
}

/**
 * Insere um evento no Google Calendar
 * @param {Object} event - Dados do evento
 */
function insertCalendarEvent(event) {
    // Criar requisição para inserir evento
    gapi.client.calendar.events.insert({
        'calendarId': googleCalendarConfig.calendarId,
        'resource': event
    }).then(response => {
        // Evento criado com sucesso
        console.log('Evento adicionado ao Google Calendar:', response);
        showNotification('Evento adicionado ao Google Calendar com sucesso!', 'success');
    }).catch(error => {
        console.error('Erro ao adicionar evento ao Google Calendar:', error);
        showNotification('Erro ao adicionar evento ao Google Calendar. Tente novamente.', 'error');
    });
}

/**
 * Verifica a disponibilidade de horários no Google Calendar
 * @param {Date} date - Data para verificar disponibilidade
 * @param {Function} callback - Função de callback para receber os horários ocupados
 */
function checkGoogleCalendarAvailability(date, callback) {
    // Verificar se a API foi inicializada e o usuário está autenticado
    if (!googleApiInitialized || !googleAuth.isSignedIn.get()) {
        console.warn('API do Google não inicializada ou usuário não autenticado.');
        callback([]);
        return;
    }
    
    // Definir intervalo de tempo para verificar (dia inteiro)
    const timeMin = new Date(date);
    timeMin.setHours(0, 0, 0, 0);
    
    const timeMax = new Date(date);
    timeMax.setHours(23, 59, 59, 999);
    
    // Buscar eventos no calendário
    gapi.client.calendar.events.list({
        'calendarId': googleCalendarConfig.calendarId,
        'timeMin': timeMin.toISOString(),
        'timeMax': timeMax.toISOString(),
        'singleEvents': true,
        'orderBy': 'startTime'
    }).then(response => {
        // Processar eventos
        const events = response.result.items;
        const busySlots = [];
        
        if (events && events.length > 0) {
            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                
                // Verificar se o evento tem horário definido
                if (event.start.dateTime && event.end.dateTime) {
                    const start = new Date(event.start.dateTime);
                    const end = new Date(event.end.dateTime);
                    
                    // Adicionar à lista de horários ocupados
                    busySlots.push({
                        start: `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`,
                        end: `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`
                    });
                }
            }
        }
        
        // Retornar horários ocupados
        callback(busySlots);
    }).catch(error => {
        console.error('Erro ao verificar disponibilidade no Google Calendar:', error);
        callback([]);
    });
}

/**
 * Sincroniza agendamentos com o Google Calendar
 * @param {Array} bookings - Lista de agendamentos
 */
function syncBookingsWithGoogleCalendar(bookings) {
    // Verificar se a API foi inicializada e o usuário está autenticado
    if (!googleApiInitialized || !googleAuth.isSignedIn.get()) {
        console.warn('API do Google não inicializada ou usuário não autenticado.');
        return;
    }
    
    // Processar cada agendamento
    bookings.forEach(booking => {
        // Criar evento para o agendamento
        const event = {
            summary: `${booking.service.name} - ${booking.customer.name}`,
            location: businessConfig.address,
            description: `Agendamento para ${booking.service.name}. Cliente: ${booking.customer.name}. Telefone: ${booking.customer.phone}. Email: ${booking.customer.email}. Observações: ${booking.customer.notes || 'Nenhuma'}`,
            start: {
                dateTime: getISODateTime(booking.date, booking.time),
                timeZone: 'America/Sao_Paulo'
            },
            end: {
                dateTime: getISODateTime(booking.date, booking.time, booking.service.duration),
                timeZone: 'America/Sao_Paulo'
            },
            reminders: {
                useDefault: true
            }
        };
        
        // Adicionar evento ao Google Calendar
        createCalendarEvent(event);
    });
}
