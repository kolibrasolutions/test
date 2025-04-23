/**
 * Arquivo JavaScript para o sistema de agendamento
 * Responsável pelas funcionalidades específicas do agendamento
 */

// Aguardar o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o sistema de agendamento
    initBookingSystem();
});

// Variáveis globais para armazenar o estado do agendamento
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let availableTimeSlots = [];
let googleCalendarConnected = false;
let googleCalendarEvents = [];

/**
 * Inicializa o sistema de agendamento
 */
function initBookingSystem() {
    // Configurar seleção de serviço
    setupServiceSelection();
    
    // Configurar navegação entre etapas
    setupStepNavigation();
    
    // Inicializar calendário
    initCalendar();
    
    // Configurar confirmação de agendamento
    setupBookingConfirmation();
    
    console.log('Sistema de agendamento inicializado com sucesso!');
}

/**
 * Configura a seleção de serviço
 */
function setupServiceSelection() {
    const serviceOptions = document.querySelectorAll('.service-option');
    const btnNext = document.querySelector('#step-1 .btn-next');
    
    // Adicionar evento de clique para cada opção de serviço
    serviceOptions.forEach(option => {
        const selectButton = option.querySelector('.btn-select');
        
        selectButton.addEventListener('click', function() {
            // Remover seleção anterior
            serviceOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Adicionar seleção atual
            option.classList.add('selected');
            
            // Armazenar serviço selecionado
            selectedService = {
                id: option.dataset.serviceId,
                name: option.dataset.serviceName,
                price: parseFloat(option.dataset.servicePrice),
                duration: parseInt(option.dataset.serviceDuration)
            };
            
            // Habilitar botão de próximo
            btnNext.disabled = false;
            
            console.log('Serviço selecionado:', selectedService);
        });
    });
}

/**
 * Configura a navegação entre etapas
 */
function setupStepNavigation() {
    const steps = document.querySelectorAll('.booking-step-content');
    const stepIndicators = document.querySelectorAll('.booking-steps .step');
    const btnNext = document.querySelectorAll('.btn-next');
    const btnPrev = document.querySelectorAll('.btn-prev');
    
    // Configurar botões de próximo
    btnNext.forEach(btn => {
        btn.addEventListener('click', function() {
            // Encontrar a etapa atual
            const currentStep = this.closest('.booking-step-content');
            const currentIndex = Array.from(steps).indexOf(currentStep);
            
            // Verificar se é uma etapa válida
            if (currentIndex >= 0 && currentIndex < steps.length - 1) {
                // Esconder etapa atual
                currentStep.classList.remove('active');
                stepIndicators[currentIndex].classList.add('completed');
                
                // Mostrar próxima etapa
                steps[currentIndex + 1].classList.add('active');
                stepIndicators[currentIndex + 1].classList.add('active');
                
                // Ações específicas para cada etapa
                if (currentIndex === 0) {
                    // Após selecionar o serviço, atualizar calendário
                    updateCalendar();
                } else if (currentIndex === 1) {
                    // Após selecionar a data, carregar horários disponíveis
                    loadAvailableTimeSlots();
                } else if (currentIndex === 2) {
                    // Após selecionar o horário, atualizar resumo
                    updateBookingSummary();
                }
            }
        });
    });
    
    // Configurar botões de voltar
    btnPrev.forEach(btn => {
        btn.addEventListener('click', function() {
            // Encontrar a etapa atual
            const currentStep = this.closest('.booking-step-content');
            const currentIndex = Array.from(steps).indexOf(currentStep);
            
            // Verificar se é uma etapa válida
            if (currentIndex > 0) {
                // Esconder etapa atual
                currentStep.classList.remove('active');
                stepIndicators[currentIndex].classList.remove('active');
                
                // Mostrar etapa anterior
                steps[currentIndex - 1].classList.add('active');
                stepIndicators[currentIndex - 1].classList.add('active');
            }
        });
    });
}

/**
 * Inicializa o calendário
 */
function initCalendar() {
    const calendarContainer = document.getElementById('booking-calendar');
    
    if (!calendarContainer) return;
    
    // Data atual
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Renderizar calendário para o mês atual
    renderCalendar(calendarContainer, currentYear, currentMonth);
}

/**
 * Renderiza o calendário para um mês específico
 * @param {HTMLElement} container - Elemento onde o calendário será renderizado
 * @param {number} year - Ano
 * @param {number} month - Mês (0-11)
 */
function renderCalendar(container, year, month) {
    // Limpar conteúdo existente
    container.innerHTML = '';
    
    // Criar estrutura do calendário
    const calendarHTML = document.createElement('div');
    calendarHTML.className = 'calendar-wrapper';
    
    // Cabeçalho do calendário
    const header = document.createElement('div');
    header.className = 'calendar-header';
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    header.innerHTML = `
        <div class="calendar-nav">
            <button class="calendar-nav-btn prev-month"><i class="fas fa-chevron-left"></i></button>
        </div>
        <div class="calendar-title">${monthNames[month]} ${year}</div>
        <div class="calendar-nav">
            <button class="calendar-nav-btn next-month"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;
    
    calendarHTML.appendChild(header);
    
    // Dias da semana
    const weekdays = document.createElement('div');
    weekdays.className = 'calendar-weekdays';
    
    const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    weekdayNames.forEach(day => {
        const weekday = document.createElement('div');
        weekday.className = 'weekday';
        weekday.textContent = day;
        weekdays.appendChild(weekday);
    });
    
    calendarHTML.appendChild(weekdays);
    
    // Dias do mês
    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar-days';
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay(); // 0 (Domingo) a 6 (Sábado)
    
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Data atual
    const today = new Date();
    
    // Dias do mês anterior
    for (let i = startingDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month disabled';
        day.textContent = prevMonthLastDay - i;
        daysContainer.appendChild(day);
    }
    
    // Dias do mês atual
    for (let i = 1; i <= totalDays; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        // Verificar se é hoje
        if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
            day.classList.add('today');
        }
        
        // Verificar se é um dia passado
        const currentDate = new Date(year, month, i);
        if (currentDate < today && !(year === today.getFullYear() && month === today.getMonth() && i === today.getDate())) {
            day.classList.add('disabled');
        } else {
            // Verificar se é um dia de trabalho
            const dayOfWeek = new Date(year, month, i).getDay();
            if (!bookingConfig.workingDays.includes(dayOfWeek)) {
                day.classList.add('disabled');
            } else {
                // Adicionar evento de clique
                day.addEventListener('click', function() {
                    // Remover seleção anterior
                    const selectedDays = document.querySelectorAll('.calendar-day.selected');
                    selectedDays.forEach(d => d.classList.remove('selected'));
                    
                    // Adicionar seleção atual
                    this.classList.add('selected');
                    
                    // Armazenar data selecionada
                    selectedDate = new Date(year, month, i);
                    
                    // Habilitar botão de próximo
                    const btnNext = document.querySelector('#step-2 .btn-next');
                    btnNext.disabled = false;
                    
                    console.log('Data selecionada:', selectedDate);
                });
            }
        }
        
        daysContainer.appendChild(day);
    }
    
    // Dias do próximo mês
    const totalCells = 42; // 6 linhas x 7 colunas
    const remainingCells = totalCells - (startingDay + totalDays);
    
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month disabled';
        day.textContent = i;
        daysContainer.appendChild(day);
    }
    
    calendarHTML.appendChild(daysContainer);
    container.appendChild(calendarHTML);
    
    // Adicionar eventos para navegação do calendário
    const prevMonthBtn = container.querySelector('.prev-month');
    const nextMonthBtn = container.querySelector('.next-month');
    
    prevMonthBtn.addEventListener('click', function() {
        let newMonth = month - 1;
        let newYear = year;
        
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }
        
        renderCalendar(container, newYear, newMonth);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        let newMonth = month + 1;
        let newYear = year;
        
        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        
        renderCalendar(container, newYear, newMonth);
    });
}

/**
 * Atualiza o calendário com base no serviço selecionado
 */
function updateCalendar() {
    // Implementação futura: bloquear datas com base na disponibilidade do serviço
    console.log('Calendário atualizado para o serviço:', selectedService);
}

/**
 * Carrega os horários disponíveis para a data selecionada
 */
function loadAvailableTimeSlots() {
    const timeSlotsContainer = document.querySelector('.time-slots-container');
    
    if (!timeSlotsContainer || !selectedDate) return;
    
    // Limpar conteúdo existente
    timeSlotsContainer.innerHTML = '';
    
    // Adicionar indicador de status do Google Calendar
    const statusContainer = document.createElement('div');
    statusContainer.className = 'google-calendar-status';
    
    if (typeof gapi !== 'undefined' && gapi.auth2 && gapi.auth2.getAuthInstance()) {
        const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        
        if (isSignedIn) {
            statusContainer.innerHTML = '<div class="status connected"><i class="fas fa-check-circle"></i> Conectado ao Google Calendar</div>';
            googleCalendarConnected = true;
            
            // Adicionar classe especial ao container para mudar as cores
            timeSlotsContainer.classList.add('google-calendar-connected');
            
            // Buscar eventos do Google Calendar
            checkGoogleCalendarAvailability(selectedDate, function(busySlots) {
                googleCalendarEvents = busySlots;
                generateTimeSlots(timeSlotsContainer);
            });
        } else {
            statusContainer.innerHTML = `
                <div class="status disconnected">
                    <i class="fas fa-exclamation-circle"></i> Não conectado ao Google Calendar
                    <button id="connect-google-calendar" class="btn-connect">Conectar</button>
                </div>
            `;
            googleCalendarConnected = false;
            
            // Remover classe especial do container
            timeSlotsContainer.classList.remove('google-calendar-connected');
            
            // Gerar slots de tempo sem dados do Google Calendar
            generateTimeSlots(timeSlotsContainer);
            
            // Adicionar evento para o botão de conexão
            setTimeout(() => {
                const connectBtn = document.getElementById('connect-google-calendar');
                if (connectBtn) {
                    connectBtn.addEventListener('click', function() {
                        authenticateWithGoogle().then(() => {
                            // Recarregar horários após autenticação
                            loadAvailableTimeSlots();
                        });
                    });
                }
            }, 100);
        }
    } else {
        statusContainer.innerHTML = '<div class="status error"><i class="fas fa-times-circle"></i> API do Google Calendar não disponível</div>';
        googleCalendarConnected = false;
        
        // Remover classe especial do container
        timeSlotsContainer.classList.remove('google-calendar-connected');
        
        // Gerar slots de tempo sem dados do Google Calendar
        generateTimeSlots(timeSlotsContainer);
    }
    
    timeSlotsContainer.appendChild(statusContainer);
}

/**
 * Gera os slots de tempo para a data selecionada
 * @param {HTMLElement} container - Container onde os slots serão renderizados
 */
function generateTimeSlots(container) {
    // Gerar horários disponíveis
    const { start, end, interval, lunchStart, lunchEnd } = bookingConfig.workingHours;
    
    // Converter strings de horário para minutos desde o início do dia
    const startMinutes = convertTimeToMinutes(start);
    const endMinutes = convertTimeToMinutes(end);
    const lunchStartMinutes = convertTimeToMinutes(lunchStart);
    const lunchEndMinutes = convertTimeToMinutes(lunchEnd);
    
    // Gerar slots de tempo
    availableTimeSlots = [];
    
    for (let minutes = startMinutes; minutes < endMinutes; minutes += interval) {
        const timeString = convertMinutesToTime(minutes);
        const isLunchTime = minutes >= lunchStartMinutes && minutes < lunchEndMinutes;
        
        // Verificar se o horário já passou (para o dia atual)
        const isToday = selectedDate.toDateString() === new Date().toDateString();
        const currentTime = new Date();
        const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        const isPastTime = isToday && minutes <= currentMinutes;
        
        // Determinar status do slot
        let status = 'available';
        let source = '';
        
        if (isLunchTime) {
            status = 'lunch';
        } else if (isPastTime) {
            status = 'booked';
        } else if (googleCalendarConnected && googleCalendarEvents.length > 0) {
            // Verificar se o horário está ocupado no Google Calendar
            const slotStart = timeString;
            const slotEndMinutes = minutes + selectedService.duration;
            const slotEnd = convertMinutesToTime(slotEndMinutes);
            
            for (let i = 0; i < googleCalendarEvents.length; i++) {
                const event = googleCalendarEvents[i];
                
                // Verificar se há sobreposição de horários
                if ((slotStart >= event.start && slotStart < event.end) || 
                    (slotEnd > event.start && slotEnd <= event.end) ||
                    (slotStart <= event.start && slotEnd >= event.end)) {
                    status = 'booked';
                    source = 'google';
                    break;
                }
            }
        } else {
            // Simular alguns horários já agendados (aleatoriamente)
            // Em uma implementação real, isso viria do banco de dados ou API
            if (Math.random() < 0.3) {
                status = 'booked';
            }
        }
        
        // Se o slot estiver disponível, adicionar à lista
        if (status === 'available') {
            availableTimeSlots.push(timeString);
        }
        
        // Criar elemento de slot de tempo
        const timeSlot = document.createElement('div');
        timeSlot.className = `time-slot ${status}`;
        if (source === 'google') {
            timeSlot.classList.add('google-event');
        }
        timeSlot.textContent = timeString;
        
        // Adicionar evento de clique para slots disponíveis
        if (status === 'available') {
            timeSlot.addEventListener('click', function() {
                // Remover seleção anterior
                const selectedSlots = document.querySelectorAll('.time-slot.selected');
                selectedSlots.forEach(slot => slot.classList.remove('selected'));
                
                // Adicionar seleção atual
                this.classList.add('selected');
                
                // Armazenar horário selecionado
                selectedTime = timeString;
                
                // Habilitar botão de próximo
                const btnNext = document.querySelector('#step-3 .btn-next');
                btnNext.disabled = false;
                
                console.log('Horário selecionado:', selectedTime);
            });
        }
        
        container.appendChild(timeSlot);
    }
}

/**
 * Atualiza o resumo do agendamento
 */
function updateBookingSummary() {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    // Atualizar informações do resumo
    document.getElementById('summary-service').textContent = selectedService.name;
    document.getElementById('summary-date').textContent = formatDate(selectedDate);
    document.getElementById('summary-time').textContent = selectedTime;
    document.getElementById('summary-price').textContent = formatCurrency(selectedService.price);
    
    // Configurar botão de adicionar ao calendário
    const addToCalendarBtn = document.getElementById('btn-add-calendar');
    if (addToCalendarBtn) {
        // Sempre tornar o botão clicável
        addToCalendarBtn.disabled = false;
        
        // Verificar se o Google Calendar está conectado
        if (googleCalendarConnected) {
            addToCalendarBtn.textContent = 'Adicionar ao Google Calendar';
        } else {
            addToCalendarBtn.textContent = 'Conectar ao Google Calendar';
        }
        
        // Adicionar evento de clique
        addToCalendarBtn.onclick = function() {
            addBookingToGoogleCalendar();
        };
    }
}

/**
 * Adiciona o agendamento ao Google Calendar
 */
function addBookingToGoogleCalendar() {
    if (!selectedService || !selectedDate || !selectedTime) {
        showNotification('Erro: Informações de agendamento incompletas.', 'error');
        return;
    }
    
    // Obter dados do cliente
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerNotes = document.getElementById('customer-notes').value;
    
    // Verificar se os campos obrigatórios estão preenchidos
    if (!customerName || !customerPhone || !customerEmail) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Criar objeto de agendamento
    const booking = {
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            notes: customerNotes
        }
    };
    
    // Criar evento para o Google Calendar
    const startDateTime = getISODateTime(booking.date, booking.time);
    const endDateTime = getISODateTime(booking.date, booking.time, booking.service.duration);
    
    const event = {
        summary: `${booking.service.name} - ${booking.customer.name}`,
        location: businessConfig.address,
        description: `Agendamento para ${booking.service.name}. Cliente: ${booking.customer.name}. Telefone: ${booking.customer.phone}. Email: ${booking.customer.email}. Observações: ${booking.customer.notes || 'Nenhuma'}`,
        start: {
            dateTime: startDateTime,
            timeZone: 'America/Sao_Paulo'
        },
        end: {
            dateTime: endDateTime,
            timeZone: 'America/Sao_Paulo'
        },
        reminders: {
            useDefault: true
        }
    };
    
    // Adicionar evento ao Google Calendar
    if (typeof addEventToGoogleCalendar === 'function') {
        addEventToGoogleCalendar(event);
    } else {
        // Fallback para quando a API do Google não está disponível
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.summary)}&dates=${startDateTime.replace(/[-:]/g, '').replace('.000', '')
}/${endDateTime.replace(/[-:]/g, '').replace('.000', '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;
        
        window.open(calendarUrl, '_blank');
    }
}

/**
 * Configura a confirmação de agendamento
 */
function setupBookingConfirmation() {
    const btnConfirm = document.getElementById('btn-confirm');
    
    if (!btnConfirm) return;
    
    btnConfirm.addEventListener('click', function() {
        // Verificar se o formulário é válido
        const form = document.getElementById('booking-form');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Obter dados do cliente
        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const customerEmail = document.getElementById('customer-email').value;
        const customerNotes = document.getElementById('customer-notes').value;
        
        // Criar objeto de agendamento
        const booking = {
            service: selectedService,
            date: selectedDate,
            time: selectedTime,
            customer: {
                name: customerName,
                phone: customerPhone,
                email: customerEmail,
                notes: customerNotes
            }
        };
        
        // Enviar agendamento para o servidor (simulado)
        submitBooking(booking);
    });
}

/**
 * Envia o agendamento para o servidor (simulado)
 * @param {Object} booking - Dados do agendamento
 */
function submitBooking(booking) {
    // Simular envio para o servidor
    console.log('Enviando agendamento:', booking);
    
    // Simular resposta do servidor após 1 segundo
    setTimeout(() => {
        // Simular sucesso
        const success = true;
        
        if (success) {
            // Mostrar mensagem de sucesso
            showBookingConfirmation(booking);
            
            // Adicionar ao Google Calendar se estiver conectado
            if (googleCalendarConnected) {
                addBookingToGoogleCalendar();
            }
        } else {
            // Mostrar mensagem de erro
            showNotification('Erro ao realizar agendamento. Por favor, tente novamente.', 'error');
        }
    }, 1000);
}

/**
 * Mostra a confirmação de agendamento
 * @param {Object} booking - Dados do agendamento
 */
function showBookingConfirmation(booking) {
    // Esconder formulário
    const bookingForm = document.getElementById('booking-form');
    bookingForm.style.display = 'none';
    
    // Mostrar confirmação
    const confirmationContainer = document.getElementById('booking-confirmation');
    confirmationContainer.style.display = 'block';
    
    // Atualizar informações da confirmação
    document.getElementById('confirmation-service').textContent = booking.service.name;
    document.getElementById('confirmation-date').textContent = formatDate(booking.date);
    document.getElementById('confirmation-time').textContent = booking.time;
    document.getElementById('confirmation-name').textContent = booking.customer.name;
    document.getElementById('confirmation-phone').textContent = booking.customer.phone;
    document.getElementById('confirmation-email').textContent = booking.customer.email;
    
    // Mostrar notificação
    showNotification('Agendamento realizado com sucesso!', 'success');
}

/**
 * Mostra uma notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Verificar se o container de notificações existe
    let notificationContainer = document.getElementById('notification-container');
    
    // Criar container se não existir
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Adicionar notificação ao container
    notificationContainer.appendChild(notification);
    
    // Adicionar evento para fechar notificação
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.classList.add('closing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Remover notificação após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('closing');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Converte uma string de horário para minutos desde o início do dia
 * @param {string} timeString - String de horário no formato HH:MM
 * @returns {number} - Minutos desde o início do dia
 */
function convertTimeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Converte minutos desde o início do dia para uma string de horário
 * @param {number} minutes - Minutos desde o início do dia
 * @returns {string} - String de horário no formato HH:MM
 */
function convertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Formata uma data para exibição
 * @param {Date} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
function formatDate(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

/**
 * Formata um valor para exibição como moeda
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda
 */
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Obtém uma string de data e hora no formato ISO
 * @param {Date} date - Data
 * @param {string} timeString - String de horário no formato HH:MM
 * @param {number} durationMinutes - Duração em minutos (opcional)
 * @returns {string} - Data e hora no formato ISO
 */
function getISODateTime(date, timeString, durationMinutes = 0) {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    
    if (durationMinutes) {
        dateTime.setMinutes(dateTime.getMinutes() + durationMinutes);
    }
    
    return dateTime.toISOString();
}
