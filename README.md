# Apresentação comercial interativa · Segantini Psicologia Empresarial

Ferramenta comercial de 2 a 4 minutos, para enviar pelo WhatsApp antes, durante ou depois de uma reunião.
O lead conhece a Segantini, identifica os próprios desafios, vê as soluções ligadas a eles, lê depoimentos reais
e responde um diagnóstico rápido. As respostas caem numa planilha do Google Sheets.

## Jornada

| # | Etapa | O que o lead faz |
|---|-------|------------------|
| 1 | Conheça a Segantini | Abertura com logo, posicionamento e indicadores + "Quem somos" (Letícia, pilares e "o que a gente não é") |
| 2 | Desafios | Marca, em cards, os desafios que vive (13 opções, múltipla escolha) |
| 3 | Soluções | Vê as 9 soluções, com as **ligadas aos desafios marcados primeiro**; abre cada uma (problema → o que muda) e marca interesse |
| 4 | Clientes | Indicadores, carrossel de depoimentos, cases com números, empresas atendidas e "Ver todas as avaliações" |
| 5 | Sua empresa | 5 perguntas rápidas (porte, RH, desafios e soluções já pré-preenchidos, campo aberto) + nome/empresa/contato |
| 6 | Próximo passo | Mensagem personalizada, 3 soluções sugeridas e botão de WhatsApp com mensagem pronta |

## Estrutura dos arquivos

```
index.html                 página (não precisa editar)
js/content.js              ← TODO O CONTEÚDO EDITÁVEL (textos, desafios, soluções, depoimentos, contato)
js/app.js                  navegação, interações e envio
css/styles.css             visual (cores da marca no topo do arquivo, em :root)
assets/                    logo oficial, símbolo, foto e imagem de prévia do link
api/lead.js                função da Vercel que recebe as respostas e repassa ao Google
google-apps-script/Code.gs script que grava na planilha
vercel.json                cabeçalhos de segurança
```

## Link por vendedor (rastreio de quem enviou)

Cada vendedor pode enviar o link com o próprio nome, e isso aparece na coluna **Vendedor (link)** da planilha:

```
https://SEU-LINK.vercel.app/?v=Ana
https://SEU-LINK.vercel.app/?v=Carlos&utm_source=instagram
```

## Propostas personalizadas por gestor

Página interna: **`/gerador`** (ex.: `https://apresentacao-segantini.vercel.app/gerador`).
O vendedor preenche nome do gestor, empresa, desafios já conversados, até 4 soluções a destacar e uma
mensagem de abertura, e recebe um link único (com botões Copiar, Ver como o gestor e Enviar no WhatsApp).

O gestor que abre o link vê:
- selo "Preparada para {empresa}", saudação pelo nome e a mensagem do vendedor na abertura;
- os desafios combinados já marcados (pode ajustar);
- as soluções escolhidas no topo, com o selo "Recomendada para {empresa}";
- nome e empresa já preenchidos no formulário.

Na planilha, as respostas chegam com o código da proposta (ex.: `Proposta REDEEXEMPL-3010A8`) na coluna
**Origem** e o vendedor na coluna **Vendedor (link)** — sem nenhuma configuração extra no Apps Script.

Limites: o link não é criptografado (não coloque preços ou dados sensíveis) e o histórico de links
gerados fica só no navegador de quem gerou.

## Google Sheets — configuração (uma única vez, ~10 min)

1. Crie uma planilha nova no Google Drive da conta da Segantini (ex.: "Leads · Apresentação comercial").
2. Na planilha: **Extensões → Apps Script**. Apague o conteúdo e cole todo o arquivo `google-apps-script/Code.gs`. Salve.
3. No menu de funções, escolha **setup** e clique **▶ Executar**. Autorize com a conta Google
   ("Avançado → Acessar projeto" se aparecer o aviso de app não verificado — o app é seu).
4. Abra **Registro de execução** e copie o **SEGREDO** exibido (para ver de novo: rode a função `mostrarSegredo`).
5. **Implantar → Nova implantação →** engrenagem **App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   - Clique **Implantar** e copie a **URL do app da Web** (termina em `/exec`).
6. Na Vercel: projeto **apresentacao-segantini → Settings → Environment Variables**, crie (ambiente *Production*):
   - `SHEETS_WEBHOOK_URL` = a URL do passo 5
   - `SHEETS_SECRET` = o segredo do passo 4
7. **Deployments → ⋯ → Redeploy** no deploy mais recente (variáveis só valem após novo deploy).
8. Teste: faça a apresentação até o fim; a linha deve aparecer na aba **Respostas**.

Opcional — aviso por e-mail a cada lead: no Apps Script, edite o e-mail na função `ativarAvisoPorEmail` e rode-a uma vez.

> Se você alterar o `Code.gs` depois, use **Implantar → Gerenciar implantações → editar → Nova versão**
> (mantém a mesma URL).

### Segurança

- A planilha **continua privada**: ninguém de fora recebe link para ela.
- A URL do Apps Script e o segredo ficam **só nas variáveis da Vercel**, nunca no navegador do visitante.
- O script rejeita qualquer chamada sem o segredo; a função da Vercel limita tamanho dos campos,
  aceita só chamadas da própria página, bloqueia robôs (campo invisível) e excesso de envios por IP.
- Textos digitados pelo lead são neutralizados para não virarem fórmulas na planilha.
- O lead dá consentimento (LGPD) antes de enviar.

## Consultando os leads

- Aba **Respostas**: uma linha por preenchimento, com data/hora, nome, empresa, contato, porte, estrutura de RH,
  desafios, soluções de interesse, soluções sugeridas, texto aberto, vendedor, origem, dispositivo e tempo gasto.
- Coluna **Status comercial** (lista: Novo → Em contato → Reunião agendada → Proposta enviada → Fechado/Perdido)
  e **Observações** para o time atualizar.
- Aba **Painel**: total de leads, últimos 7 dias, funil por status, taxa de conversão, porte das empresas,
  ranking de desafios mais citados e soluções de maior interesse.
- Dica: use **Dados → Criar filtro** na aba Respostas para filtrar por vendedor ou status.

## Atualizando o conteúdo

Tudo fica em `js/content.js`, com comentários. Exemplos:
- Trocar número do WhatsApp: `contato.whatsapp` (só dígitos, com 55 + DDD).
- Novo depoimento: copie um bloco dentro de `depoimentos` e ajuste. `destaque: true` coloca no carrossel principal.
- Nova solução/desafio: copie um bloco. O campo `solucoes` de cada desafio liga o desafio às soluções sugeridas.

Como publicar a alteração: edite o arquivo no GitHub (ícone de lápis) e faça o commit — a Vercel publica sozinha
em ~1 minuto se o projeto estiver conectado ao repositório. Sem conexão Git, publique pelo painel da Vercel ou
`npx vercel --prod` na pasta do projeto.

## Hospedagem e custos

- **Vercel (plano Hobby, gratuito)**: hospedagem, HTTPS e a função `/api/lead`. Volume desta ferramenta
  fica muito abaixo dos limites gratuitos. Observação: os termos do plano Hobby são para uso não comercial;
  para uso comercial formal, a Vercel recomenda o plano Pro (US$ 20/mês por membro).
  A conta da Segantini já usa a Vercel para outros sistemas — siga o mesmo plano já contratado.
- **Google Sheets + Apps Script**: gratuitos dentro das cotas da conta Google (milhares de execuções/dia).
- Domínio próprio (opcional): ex. `apresentacao.segantiniconsultoria.com` — em Vercel → Settings → Domains,
  sem custo adicional além do domínio que vocês já têm.

## Origem do conteúdo

Todos os textos, números e depoimentos vêm da apresentação institucional "Pessoas estruturadas, negócio que cresce"
(Proposta Comercial 2026) e dos prints de avaliações do Google enviados pela Segantini. Nada foi criado.
Ajustes de transcrição: acentuação no depoimento de Marco Nippashi e as palavras [atende] e [há], entre colchetes,
porque o original diz "A Segantini ate a HANEI CONSULTORIA aproximadamente 1 ano".
