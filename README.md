# Sistema de Agendamento Online

Este é um sistema de agendamento online completo e personalizável, projetado para profissionais autônomos e pequenos negócios como barbearias, salões de beleza, manicures e outros serviços que funcionam com agendamento de horários.

## Características Principais

- **Landing Page Responsiva**: Apresenta seu negócio de forma profissional em qualquer dispositivo
- **Sistema de Agendamento Visual**: Mostra claramente horários disponíveis e ocupados
- **Integração com Google Calendar**: Sincroniza agendamentos com sua agenda do Google
- **Painel de Configuração**: Personaliza facilmente todas as informações do site
- **Design Adaptável**: Funciona perfeitamente em celulares, tablets e computadores
- **Fácil Personalização**: Altere cores, logo e informações sem conhecimento técnico

## Estrutura do Projeto

```
site_agendamento/
├── css/
│   ├── styles.css            # Estilos principais do site
│   └── config-panel.css      # Estilos do painel de configuração
├── js/
│   ├── main.js               # Funcionalidades gerais do site
│   ├── booking.js            # Sistema de agendamento
│   ├── calendar-integration.js # Integração com Google Calendar
│   ├── config-panel.js       # Painel de configuração
│   └── config.js             # Arquivo de configurações personalizáveis
├── img/                      # Pasta para imagens
├── index.html                # Página principal com sistema de agendamento
└── config.html               # Painel de configuração
```

## Guia de Personalização

### 1. Informações Básicas

Para personalizar o site para um novo cliente, você pode usar o painel de configuração ou editar diretamente o arquivo `js/config.js`. As principais informações que devem ser alteradas são:

- **Nome do Estabelecimento**: Nome do negócio do cliente
- **Informações de Contato**: Endereço, telefone, e-mail e horário de funcionamento
- **Redes Sociais**: Links para as redes sociais do cliente
- **CNPJ**: Informações legais do estabelecimento

### 2. Identidade Visual

#### Alterando o Logo

1. Prepare um arquivo de logo com fundo transparente (PNG recomendado)
2. Dimensões recomendadas: 150x70 pixels
3. Substitua o arquivo `img/logo.png` pelo novo logo
4. Ou use o painel de configuração para fazer upload do novo logo

#### Alterando as Cores

No painel de configuração ou no arquivo `js/config.js`, você pode alterar as seguintes cores:

- **Cor Principal**: Usada no cabeçalho, rodapé e elementos principais
- **Cor Secundária**: Usada em botões e elementos de destaque
- **Cor de Destaque**: Usada para indicar sucesso ou confirmação
- **Cor Escura**: Usada para textos e elementos escuros
- **Cor Clara**: Usada para fundos e elementos claros

### 3. Serviços

Adicione, edite ou remova serviços oferecidos pelo estabelecimento através do painel de configuração ou editando o array `servicesConfig` no arquivo `js/config.js`.

Para cada serviço, configure:
- Nome
- Descrição
- Preço
- Duração (em minutos)
- Ícone (usando classes do Font Awesome)

### 4. Depoimentos

Adicione, edite ou remova depoimentos de clientes através do painel de configuração ou editando o array `testimonialsConfig` no arquivo `js/config.js`.

Para cada depoimento, configure:
- Nome do cliente
- Texto do depoimento
- Imagem do cliente
- Avaliação (de 1 a 5 estrelas)

### 5. Configurações de Agendamento

Configure o funcionamento do sistema de agendamento através do painel de configuração ou editando o objeto `bookingConfig` no arquivo `js/config.js`.

Principais configurações:
- Horário de funcionamento (início, término, intervalo entre agendamentos)
- Horário de almoço
- Dias da semana disponíveis para agendamento
- Número máximo de dias no futuro para agendamento
- Tempo mínimo de antecedência para agendamento

### 6. Integração com Google Calendar

Para ativar a integração com o Google Calendar, o cliente precisará:

1. Acessar o [Google Cloud Console](https://console.cloud.google.com/)
2. Criar um novo projeto
3. Ativar a API do Google Calendar
4. Criar credenciais (Chave de API e ID do Cliente OAuth)
5. Configurar as origens JavaScript autorizadas
6. Adicionar as credenciais no painel de configuração ou no arquivo `js/config.js`

## Instruções para Implantação

### Hospedagem na Vercel

1. Crie uma conta na [Vercel](https://vercel.com/) se ainda não tiver
2. Instale a CLI da Vercel: `npm i -g vercel`
3. Navegue até a pasta do projeto: `cd site_agendamento`
4. Execute o comando: `vercel`
5. Siga as instruções para fazer login e configurar o projeto
6. Após a implantação, a Vercel fornecerá uma URL para o site

### Configuração de Domínio Personalizado

1. Acesse o painel da Vercel
2. Vá para as configurações do projeto
3. Na seção "Domains", adicione o domínio do cliente
4. Siga as instruções para configurar os registros DNS

## Suporte e Manutenção

### Atualizações de Conteúdo

Para atualizar informações como serviços, preços ou horários:
1. Acesse o painel de configuração em `config.html`
2. Faça as alterações necessárias
3. Salve as configurações
4. Faça upload do arquivo `js/config.js` atualizado para o servidor

### Backup

Recomenda-se fazer backup regular do arquivo `js/config.js`, pois ele contém todas as configurações personalizadas do site.

## Solução de Problemas Comuns

### O sistema de agendamento não mostra horários disponíveis

- Verifique se os dias e horários de funcionamento estão configurados corretamente
- Certifique-se de que a data selecionada é um dia de funcionamento
- Verifique se o horário de almoço está configurado corretamente

### A integração com o Google Calendar não funciona

- Verifique se as credenciais da API do Google estão corretas
- Certifique-se de que a API do Google Calendar está ativada no Google Cloud Console
- Verifique se as origens JavaScript autorizadas incluem o domínio do site

### As cores ou imagens não estão atualizando

- Limpe o cache do navegador
- Verifique se os arquivos foram carregados corretamente para o servidor
- Certifique-se de que os caminhos das imagens estão corretos

## Personalização Avançada

Para personalização mais avançada, como adicionar novas seções ou funcionalidades, será necessário editar os arquivos HTML, CSS e JavaScript diretamente. Recomenda-se ter conhecimentos básicos de desenvolvimento web para realizar essas alterações.

---

Para mais informações ou suporte, entre em contato conosco.
