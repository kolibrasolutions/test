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
        if (isLunchTime) {
            status = 'lunch';
        } else if (isPastTime) {
            status = 'booked';
        } else {
            // Simular alguns horários já agendados (aleatoriamente)
            // Em uma implementação real, isso viria do banco de dados ou API
            if (Math.random() < 0.3) {
                status = 'booked';
            } else {
                availableTimeSlots.push(timeString);
            }
        }
        
        // Criar elemento de slot de tempo
        const timeSlot = document.createElement('div');
        timeSlot.className = `time-slot ${status}`;
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
        
        timeSlotsContainer.appendChild(timeSlot);
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
        // Atualizar confirmação
        document.getElementById('confirmation-service').textContent = booking.service.name;
        document.getElementById('confirmation-date').textContent = formatDate(booking.date);
        document.getElementById('confirmation-time').textContent = booking.time;
        document.getElementById('confirmation-email').textContent = booking.customer.email;
        
        // Esconder etapa atual
        document.getElementById('step-4').classList.remove('active');
        
        // Mostrar confirmação
        document.getElementById('booking-confirmation').classList.add('active');
        
        // Adicionar evento para botão de adicionar ao calendário
        setupAddToCalendarButton(booking);
        
        console.log('Agendamento confirmado!');
    }, 1000);
}

/**
 * Configura o botão de adicionar ao calendário
 * @param {Object} booking - Dados do agendamento
 */
function setupAddToCalendarButton(booking) {
    const addToCalendarBtn = document.getElementById('btn-add-calendar');
    
    if (!addToCalendarBtn) return;
    
    addToCalendarBtn.addEventListener('click', function() {
        // Criar evento para Google Calendar
        const event = {
            summary: `${booking.service.name} - ${businessConfig.name}`,
            location: businessConfig.address,
            description: `Agendamento para ${booking.service.name}. Duração: ${booking.service.duration} minutos.`,
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
        
        // Verificar se a integração com Google Calendar está habilitada
        if (googleCalendarConfig.enabled && typeof addEventToGoogleCalendar === 'function') {
            addEventToGoogleCalendar(event);
        } else {
            // Fallback: criar arquivo ICS
            createICSFile(event);
        }
    });
}

/**
 * Cria um arquivo ICS para download
 * @param {Object} event - Dados do evento
 */
function createICSFile(event) {
    // Implementação básica de arquivo ICS
    const startDate = new Date(event.start.dateTime);
    const endDate = new Date(event.end.dateTime);
    
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Agendamento Online//BR',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `SUMMARY:${event.summary}`,
        `DTSTART:${formatDateForICS(startDate)}`,
        `DTEND:${formatDateForICS(endDate)}`,
        `LOCATION:${event.location}`,
        `DESCRIPTION:${event.description}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
    
    // Criar link para download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agendamento.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Formata uma data para o formato ICS
 * @param {Date} date - Data a ser formatada
 * @returns {string} - Data formatada para ICS
 */
function formatDateForICS(date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
}

/**
 * Converte uma string de horário (HH:MM) para minutos desde o início do dia
 * @param {string} timeString - Horário no formato HH:MM
 * @returns {number} - Minutos desde o início do dia
 */
function convertTimeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Converte minutos desde o início do dia para uma string de horário (HH:MM)
 * @param {number} minutes - Minutos desde o início do dia
 * @returns {string} - Horário no formato HH:MM
 */
function convertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Obtém a data e hora no formato ISO para o Google Calendar
 * @param {Date} date - Data
 * @param {string} time - Horário no formato HH:MM
 * @param {number} durationMinutes - Duração em minutos (opcional)
 * @returns {string} - Data e hora no formato ISO
 */
function getISODateTime(date, time, durationMinutes = 0) {
    const [hours, minutes] = time.split(':').map(Number);
    
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    
    if (durationMinutes > 0) {
        dateTime.setMinutes(dateTime.getMinutes() + durationMinutes);
    }
    
    return dateTime.toISOString();
}
