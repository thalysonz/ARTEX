import type { Messages } from "../types";

// { "<zh source>": ["<en>", "<pt-BR>"] }
// System → Settings (incl. update card), LLM (incl. retry), Logs, MCP.
// Some keys are sentence fragments around inline <b>/<code>/<span> elements; their
// en/pt values carry the leading/trailing spaces the surrounding markup needs.
const messages: Messages = {
  // ── shared (duplicated from common.ts so this area is self-contained) ──
  保存: ["Save", "Salvar"],
  新建: ["New", "Novo"],
  名称: ["Name", "Nome"],
  全部: ["All", "Todos"],
  删除: ["Delete", "Excluir"],
  启用: ["Enabled", "Ativado"],
  刷新: ["Refresh", "Atualizar"],
  "加载中…": ["Loading…", "Carregando…"],
  "保存失败：{error}": ["Save failed: {error}", "Falha ao salvar: {error}"],
  "删除失败：{error}": ["Delete failed: {error}", "Falha ao excluir: {error}"],
  "已删除：{name}": ["Deleted: {name}", "Excluído: {name}"],
  已保存: ["Saved", "Salvo"],
  已开启: ["On", "Ativado"],
  已关闭: ["Off", "Desativado"],
  已配置: ["Configured", "Configurado"],
  "测试中…": ["Testing…", "Testando…"],
  "（{n}）": [" ({n})", " ({n})"],
  "：": [": ", ": "],
  "。": [".", "."],
  未知: ["Unknown", "Desconhecido"],
  未知错误: ["Unknown error", "Erro desconhecido"],

  // ── Settings page ──
  "并发数必须是大于 0 的整数": [
    "Concurrency must be an integer greater than 0",
    "A concorrência deve ser um inteiro maior que 0",
  ],
  "已保存并发工作 agent 数（对之后启动的任务生效）": [
    "Worker agent concurrency saved (applies to tasks started afterwards)",
    "Concorrência de agents worker salva (vale para tarefas iniciadas depois)",
  ],
  "已保存 Python 解释器配置": ["Python interpreter saved", "Interpretador Python salvo"],
  "已开启 Agent 自动绑定流量": [
    "Agent automatic traffic binding enabled",
    "Vinculação automática de tráfego pelo Agent ativada",
  ],
  "已关闭 Agent 自动绑定流量": [
    "Agent automatic traffic binding disabled",
    "Vinculação automática de tráfego pelo Agent desativada",
  ],
  "已开启 noa 上下文压缩（对之后启动的运行生效）": [
    "noa context compaction enabled (applies to runs started afterwards)",
    "Compactação de contexto noa ativada (vale para execuções iniciadas depois)",
  ],
  "已关闭 noa 上下文压缩（恢复内置压缩）": [
    "noa context compaction disabled (built-in compaction restored)",
    "Compactação de contexto noa desativada (compactação nativa restaurada)",
  ],
  已保存网络搜索配置: ["Web search settings saved", "Configurações de busca na web salvas"],
  "已保存 Brave API Key": ["Brave API Key saved", "Brave API Key salva"],
  "已保存 Tavily API Key": ["Tavily API Key saved", "Tavily API Key salva"],
  已保存出口代理: ["Egress proxy saved", "Proxy de saída salvo"],
  "已清除出口代理（改为直连）": [
    "Egress proxy cleared (direct connection)",
    "Proxy de saída removido (conexão direta)",
  ],
  已保存全局代理: ["Global proxy saved", "Proxy global salvo"],
  "已清除全局代理（改为直连）": ["Global proxy cleared (direct connection)", "Proxy global removido (conexão direta)"],
  "搜索测试成功 · {backend} 返回 {count} 条结果": [
    "Search test passed · {backend} returned {count} results",
    "Teste de busca OK · {backend} retornou {count} resultados",
  ],
  "搜索测试失败：{error}": ["Search test failed: {error}", "Teste de busca falhou: {error}"],
  系统配置: ["Settings", "Configurações"],
  全局运行时开关: ["Global runtime switches", "Chaves globais de execução"],
  流量捕获: ["Traffic capture", "Captura de tráfego"],
  "开启后，所有 Agent 的 HTTP 流量经记录代理全量落库，并向 Agent 注入 traffic_search / traffic_get 工具与代理配置（提示词含代理说明）。":
    [
      "When on, all Agent HTTP traffic goes through the recording proxy and is fully stored, and Agents get the traffic_search / traffic_get tools plus proxy settings (the prompt includes proxy instructions).",
      "Quando ativado, todo o tráfego HTTP dos Agents passa pelo proxy de gravação e é armazenado por completo, e os Agents recebem as ferramentas traffic_search / traffic_get e a configuração de proxy (o prompt inclui instruções do proxy).",
    ],
  "关闭（默认）时不记录任何流量：Agent 不会拿到代理配置与流量工具，提示词也不含代理相关内容。切换后会即时重建 Agent 生效。":
    [
      "When off (default), no traffic is recorded: Agents get neither the proxy settings nor the traffic tools, and the prompt has no proxy-related content. Toggling rebuilds Agents immediately.",
      "Quando desativado (padrão), nenhum tráfego é gravado: os Agents não recebem a configuração de proxy nem as ferramentas de tráfego, e o prompt não tem conteúdo sobre proxy. Ao alternar, os Agents são recriados na hora.",
    ],
  "已开启 · 正在记录流量并注入代理": [
    "On · recording traffic and injecting the proxy",
    "Ativado · gravando tráfego e injetando o proxy",
  ],
  "已关闭 · 不记录、不注入代理": [
    "Off · no recording, no proxy injection",
    "Desativado · sem gravação nem injeção de proxy",
  ],
  "Agent 自动绑定流量": ["Agent automatic traffic binding", "Vinculação automática de tráfego pelo Agent"],
  "默认关闭。开启后，漏洞入库时触发的报告 Agent 会核对已有 HTTP 请求/响应，关联对应流量后再编写报告。": [
    "Off by default. When on, the report Agent triggered when a vulnerability is saved checks the existing HTTP requests/responses and links the matching traffic before writing the report. ",
    "Desativado por padrão. Quando ativado, o Agent de relatório acionado ao registrar uma vulnerabilidade verifica as requisições/respostas HTTP existentes e vincula o tráfego correspondente antes de escrever o relatório. ",
  ],
  "查阅数据包及额外的工具调用会增加 Token 消耗。": [
    "Reviewing packets and the extra tool calls increase Token usage.",
    "Consultar os pacotes e as chamadas extras de ferramentas aumenta o consumo de Tokens.",
  ],
  "TCP、未抓包或没有匹配流量时仍可正常上报。此开关不影响流量捕获、人工绑定及已保存证据的查看。对下一轮 Agent 生效；关闭后会立即拒绝新的自动绑定。":
    [
      "Reporting still works for TCP, uncaptured traffic, or when no traffic matches. This switch does not affect traffic capture, manual binding, or viewing saved evidence. Applies from the next Agent round; turning it off immediately rejects new automatic bindings.",
      "O reporte continua funcionando com TCP, tráfego não capturado ou sem tráfego correspondente. Esta opção não afeta a captura de tráfego, a vinculação manual nem a visualização de evidências salvas. Vale a partir da próxima rodada do Agent; ao desativar, novas vinculações automáticas são recusadas na hora.",
    ],
  "已开启 · 会增加 Token 消耗": ["On · increases Token usage", "Ativado · aumenta o consumo de Tokens"],
  "已关闭 · 可继续人工绑定": [
    "Off · manual binding still available",
    "Desativado · vinculação manual continua disponível",
  ],
  全局代理: ["Global proxy", "Proxy global"],
  "所有 Agent 的": ["All Agent ", "Todo o "],
  目标流量: ["target traffic", "tráfego para os alvos"],
  "经此代理出网（隐藏源 IP / 走跳板）。支持": [
    " egresses through this proxy (hides the source IP / uses a jump host). Supports",
    " dos Agents sai por este proxy (oculta o IP de origem / usa um jump host). Suporta",
  ],
  "，可带": [", optionally with", ", opcionalmente com autenticação"],
  "认证。留空=直连。": ["authentication. Empty = direct connection.", "(deixe vazio para conexão direta)."],
  "开启流量捕获时，它作为记录代理的": [
    "With traffic capture on, it acts as the recording proxy's ",
    "Com a captura de tráfego ativada, ele atua como ",
  ],
  上游: ["upstream", "upstream"],
  "（流量仍全量落库，再经此代理出网）；关闭捕获时，直接注入 Agent 的 bash / WebFetch 出网。与网络搜索代理、LLM 代理相互独立。":
    [
      " (traffic is still fully stored, then egresses via this proxy); with capture off, it is injected directly into the Agents' bash / WebFetch egress. Independent of the web search proxy and the LLM proxy.",
      " do proxy de gravação (o tráfego continua sendo armazenado e depois sai por este proxy); com a captura desativada, é injetado direto na saída de bash / WebFetch dos Agents. Independente do proxy de busca na web e do proxy do LLM.",
    ],
  提示: ["Tip", "Dica"],
  "：socks5 在关闭捕获时依赖各命令行工具对": [
    ": with capture off, socks5 relies on each CLI tool supporting",
    ": com a captura desativada, o socks5 depende de cada ferramenta de linha de comando suportar",
  ],
  "的支持（curl 可用，部分工具可能忽略）；若主要用 socks5，建议开启流量捕获——此路径由 MITM 亲自拨号，工具无感知、稳定生效。":
    [
      " (curl works; some tools may ignore it). If you mainly use socks5, enable traffic capture — the MITM then dials out itself, which is transparent to tools and reliable.",
      " (o curl suporta; algumas ferramentas podem ignorar). Se você usa principalmente socks5, ative a captura de tráfego — nesse caminho o próprio MITM faz a conexão, de forma transparente e estável para as ferramentas.",
    ],
  代理地址: ["Proxy address", "Endereço do proxy"],
  "socks5://user:pass@host:1080 或 http://host:port（留空=直连）": [
    "socks5://user:pass@host:1080 or http://host:port (empty = direct)",
    "socks5://user:pass@host:1080 ou http://host:port (vazio = direto)",
  ],
  "已配置 · 所有目标流量经此代理出网": [
    "Configured · all target traffic egresses through this proxy",
    "Configurado · todo o tráfego para os alvos sai por este proxy",
  ],
  "未配置 · 目标流量直连出网": [
    "Not configured · target traffic goes out directly",
    "Não configurado · o tráfego para os alvos sai direto",
  ],
  操作约束注入: ["Operation constraint injection", "Injeção de restrições operacionais"],
  "开启后，把每个任务的": ["When on, each task's ", "Quando ativado, as "],
  操作约束: ["operation constraints", "restrições operacionais"],
  "（在任务总览「操作约束」里维护的 allow/deny 条目）拼进对应 Agent 的系统提示，用来框定探索边界（如「仅测当前端口」「禁止爆破」）。":
    [
      " (the allow/deny entries maintained under “Operation constraints” in the task overview) are appended to the matching Agent's system prompt to bound exploration (e.g. “only test the current port”, “no brute force”).",
      " de cada tarefa (as entradas allow/deny mantidas em “Restrições operacionais” na visão geral da tarefa) são incluídas no prompt de sistema do Agent correspondente para delimitar a exploração (ex.: “testar só a porta atual”, “proibido força bruta”).",
    ],
  "可分别控制注入到规划者（planner）与执行者（worker）；默认都开。切换即时生效（下一轮读取），无需重建 Agent。关闭后该 Agent 不再看到约束。":
    [
      "Injection into the planner and the worker can be controlled separately; both on by default. Changes apply immediately (read on the next round), no Agent rebuild needed. When off, that Agent no longer sees the constraints.",
      "A injeção no planner e no worker pode ser controlada separadamente; ambas ativadas por padrão. As mudanças valem na hora (lidas na próxima rodada), sem recriar o Agent. Quando desativada, o Agent deixa de ver as restrições.",
    ],
  "注入规划者（planner）": ["Inject into planner", "Injetar no planner"],
  "注入执行者（worker）": ["Inject into worker", "Injetar no worker"],
  实验功能: ["Experimental features", "Recursos experimentais"],
  "尚在验证中的机制，默认关闭。可能改变 Agent 行为或影响稳定性，请在了解影响后启用。": [
    "Mechanisms still being validated, off by default. They may change Agent behavior or affect stability; enable them only once you understand the impact.",
    "Mecanismos ainda em validação, desativados por padrão. Podem mudar o comportamento dos Agents ou afetar a estabilidade; ative só depois de entender o impacto.",
  ],
  "noa 上下文压缩": ["noa context compaction", "Compactação de contexto noa"],
  "：由模型主动压缩长对话历史（norma v0.4.0）。开启后平台接入的四类 Agent（": [
    ": the model proactively compacts long conversation history (norma v0.4.0). When on, the platform's four Agent types (",
    ": o modelo compacta proativamente históricos longos de conversa (norma v0.4.0). Quando ativado, os quatro tipos de Agent da plataforma (",
  ],
  "规划者 / 执行者 / 主 Agent / 对话": [
    "planner / worker / main Agent / chat",
    "planner / worker / Agent principal / chat",
  ],
  "）改用 noa 接管上下文，取代内置压缩，压缩原文会归档到任务工作目录下便于回溯。切换即时生效（对之后启动的运行生效），无需重建 Agent；关闭后立即恢复内置压缩。":
    [
      ") hand context management to noa instead of the built-in compaction; the original text is archived under the task working directory for later review. Takes effect immediately (for runs started afterwards), no Agent rebuild needed; turning it off restores the built-in compaction right away.",
      ") passam a usar o noa no lugar da compactação nativa; o texto original é arquivado no diretório de trabalho da tarefa para consulta. Vale na hora (para execuções iniciadas depois), sem recriar o Agent; ao desativar, a compactação nativa volta imediatamente.",
    ],
  网络搜索: ["Web search", "Busca na web"],
  这是网络搜索的: ["This is the web search ", "Esta é a "],
  "总开关 + 来源配置": ["master switch + source settings", "chave geral + configuração de fonte"],
  "。开启后，才能在每个 Agent 的配置里单独选择是否启用": [
    ". Once on, each Agent's settings can individually enable ",
    " da busca na web. Depois de ativada, cada Agent pode habilitar individualmente o ",
  ],
  "（仅返回标题/链接/摘要，不抓取正文；抓取由 WebFetch 负责）。网络搜索不走记录代理，独立于流量捕获。": [
    " (returns only titles/links/snippets, no page content; fetching is WebFetch's job). Web search does not go through the recording proxy and is independent of traffic capture.",
    " (retorna só títulos/links/resumos, sem baixar o conteúdo; isso fica a cargo do WebFetch). A busca na web não passa pelo proxy de gravação e é independente da captura de tráfego.",
  ],
  "来源可选 DuckDuckGo（ddgs）（无需 Key）、Brave（免费版）（需填写 Brave API Key）、Tavily（需填写 Tavily API Key）或 DeepSeek（复用当前 LLM 配置）。总开关关闭时，各 Agent 的网络搜索开关不可用。":
    [
      "Available sources: DuckDuckGo (ddgs) (no key needed), Brave (free tier) (Brave API Key required), Tavily (Tavily API Key required) or DeepSeek (reuses the current LLM config). When the master switch is off, the per-Agent web search toggles are unavailable.",
      "Fontes disponíveis: DuckDuckGo (ddgs) (sem Key), Brave (plano gratuito) (requer Brave API Key), Tavily (requer Tavily API Key) ou DeepSeek (reutiliza a configuração de LLM atual). Com a chave geral desativada, as opções de busca na web de cada Agent ficam indisponíveis.",
    ],
  "总开关已开启 · 可在各 Agent 配置里单独启用": [
    "Master switch on · enable it per Agent in its settings",
    "Chave geral ativada · habilite em cada Agent nas configurações dele",
  ],
  "已关闭 · 各 Agent 无法启用网络搜索": [
    "Off · Agents cannot enable web search",
    "Desativado · os Agents não podem usar busca na web",
  ],
  搜索来源: ["Search source", "Fonte de busca"],
  选择来源: ["Select source", "Selecione a fonte"],
  "DuckDuckGo（ddgs · 免费无 Key）": ["DuckDuckGo (ddgs · free, no key)", "DuckDuckGo (ddgs · grátis, sem Key)"],
  "Brave（免费版 · 需 Key）": ["Brave (free tier · key required)", "Brave (plano gratuito · requer Key)"],
  "Tavily（需 Key）": ["Tavily (key required)", "Tavily (requer Key)"],
  "DeepSeek（官方）": ["DeepSeek (official)", "DeepSeek (oficial)"],
  "DeepSeek 官方联网搜索": ["DeepSeek official web search", "Busca na web oficial do DeepSeek"],
  该来源直接复用: ["This source reuses the ", "Esta fonte reutiliza a "],
  "当前激活的 LLM 配置": ["currently active LLM config", "configuração de LLM ativa"],
  "。因此它": [". It therefore ", ". Por isso, ela "],
  "仅支持 DeepSeek 官方模型": ["only supports official DeepSeek models", "só suporta os modelos oficiais do DeepSeek"],
  "，且该配置": [", and that config ", ", e essa configuração "],
  "必须使用 anthropic 协议": ["must use the anthropic protocol", "precisa usar o protocolo anthropic"],
  "——DeepSeek 的 OpenAI 协议端点不支持服务端搜索。切换 LLM 配置后此来源可能失效。": [
    " — DeepSeek's OpenAI-protocol endpoint does not support server-side search. Switching LLM configs may break this source.",
    " — o endpoint de protocolo OpenAI do DeepSeek não suporta busca no servidor. Trocar a configuração de LLM pode invalidar esta fonte.",
  ],
  "与其它来源不同，搜索由": ["Unlike other sources, search is", "Diferente das outras fontes, a busca é"],
  "DeepSeek 服务端执行": ["run server-side by DeepSeek", "executada no servidor do DeepSeek"],
  "：每次搜索会额外消耗一次模型调用（产生 Token 费用），搜索请求不经过上面的出口代理，也不计入流量留痕；返回结果只有标题和链接（无摘要），需要正文时由 WebFetch 抓取。":
    [
      ": each search costs an extra model call (incurring Token charges), search requests bypass the egress proxy above and are not recorded in traffic logs; results contain only titles and links (no snippets), and WebFetch fetches content when needed.",
      ": cada busca consome uma chamada extra ao modelo (gerando custo de Tokens), as requisições não passam pelo proxy de saída acima nem ficam registradas no tráfego; os resultados trazem só títulos e links (sem resumo), e o WebFetch baixa o conteúdo quando necessário.",
    ],
  "是否满足上述条件由你自行确认，系统不做拦截；可用下方「测试搜索」按钮实际跑一次来验证。": [
    "It's up to you to confirm these conditions are met; the system won't block it. Use the “Test search” button below to verify with a real run.",
    "Cabe a você confirmar se essas condições são atendidas; o sistema não bloqueia. Use o botão “Testar busca” abaixo para validar com uma execução real.",
  ],
  "已配置（留空则不变）": ["Configured (leave empty to keep)", "Configurada (deixe vazio para manter)"],
  "输入 Brave API Key": ["Enter Brave API Key", "Informe a Brave API Key"],
  "已选择 Brave 但尚未配置 Key —— 在保存 Key 之前，搜索工具不会启用。": [
    "Brave is selected but no key is configured — the search tool stays off until a key is saved.",
    "Brave selecionado, mas sem Key configurada — a ferramenta de busca só será ativada depois que a Key for salva.",
  ],
  "免费版额度约 2,000 次/月。前往 https://brave.com/search/api/ 获取 Key。": [
    "The free tier allows about 2,000 queries/month. Get a key at https://brave.com/search/api/.",
    "O plano gratuito permite cerca de 2.000 consultas/mês. Obtenha a Key em https://brave.com/search/api/.",
  ],
  "输入 Tavily API Key（tvly-…）": ["Enter Tavily API Key (tvly-…)", "Informe a Tavily API Key (tvly-…)"],
  "已选择 Tavily 但尚未配置 Key —— 在保存 Key 之前，搜索工具不会启用。": [
    "Tavily is selected but no key is configured — the search tool stays off until a key is saved.",
    "Tavily selecionado, mas sem Key configurada — a ferramenta de busca só será ativada depois que a Key for salva.",
  ],
  "前往 https://tavily.com 注册并获取 API Key。": [
    "Sign up at https://tavily.com to get an API Key.",
    "Cadastre-se em https://tavily.com para obter uma API Key.",
  ],
  "出口代理（可选）": ["Egress proxy (optional)", "Proxy de saída (opcional)"],
  "http://host:port 或 socks5://host:port（留空=直连）": [
    "http://host:port or socks5://host:port (empty = direct)",
    "http://host:port ou socks5://host:port (vazio = direto)",
  ],
  "独立出口代理，仅用于访问搜索端点（VPN/SOCKS 等）。与记录流量的 MITM 代理无关；网络不通时经此代理访问。": [
    "Separate egress proxy, used only to reach the search endpoints (VPN/SOCKS, etc.). Unrelated to the traffic-recording MITM proxy; use it when the network can't reach them directly.",
    "Proxy de saída separado, usado só para acessar os endpoints de busca (VPN/SOCKS etc.). Não tem relação com o proxy MITM de gravação de tráfego; use quando a rede não alcançar os endpoints diretamente.",
  ],
  "用当前配置（来源 + 代理 + Key）实际搜索一次「test」，验证是否可用。": [
    "Runs a real search for “test” with the current settings (source + proxy + key) to verify it works.",
    "Faz uma busca real por “test” com a configuração atual (fonte + proxy + Key) para validar se funciona.",
  ],
  测试搜索: ["Test search", "Testar busca"],
  "自定义脚本 · Python 解释器": [
    "Custom scripts · Python interpreter",
    "Scripts personalizados · Interpretador Python",
  ],
  "自定义 script 类型工具用它跑 Python。开机会自动检测（python3 优先）；此处可手填 venv / 特定版本的绝对路径，留空则运行时自动检测。":
    [
      "Custom script tools use it to run Python. It is auto-detected at startup (python3 preferred); you can enter the absolute path of a venv / specific version here, or leave it empty to auto-detect at runtime.",
      "Ferramentas personalizadas do tipo script usam este interpretador para rodar Python. Ele é detectado automaticamente na inicialização (python3 tem preferência); aqui você pode informar o caminho absoluto de um venv / versão específica, ou deixar vazio para detectar em tempo de execução.",
    ],
  "/usr/bin/python3（留空=自动检测）": [
    "/usr/bin/python3 (empty = auto-detect)",
    "/usr/bin/python3 (vazio = detecção automática)",
  ],
  重新检测: ["Re-detect", "Detectar novamente"],
  "工作并发 · Work Agent 数": ["Worker concurrency · Work Agent count", "Concorrência · Nº de Work Agents"],
  "每个任务并发运行的工作 agent 数量（默认 3）。数值越大并发探测越多、消耗也越高。修改后": [
    "Number of worker agents running concurrently per task (default 3). Higher values mean more parallel probing and higher cost. Changes ",
    "Quantidade de agents worker rodando em paralelo por tarefa (padrão 3). Valores maiores significam mais sondagem em paralelo e mais custo. As alterações ",
  ],
  对之后启动的任务生效: ["apply to tasks started afterwards", "valem para tarefas iniciadas depois"],
  "，正在运行的任务不受影响。": ["; running tasks are unaffected.", "; tarefas em execução não são afetadas."],
  会话输入框发送键位: ["Chat input send key", "Tecla de envio do chat"],
  "对话页与任务详情的主 Agent 会话输入框共用此设置，选择后立即生效、无需保存。": [
    "Shared by the Chat page and the main Agent session input in task details; takes effect immediately, no save needed.",
    "Compartilhado pela página de Chat e pela caixa de sessão do Agent principal nos detalhes da tarefa; vale na hora, sem precisar salvar.",
  ],
  该偏好: ["This preference is ", "Esta preferência fica "],
  只存在本浏览器: ["stored only in this browser", "salva apenas neste navegador"],
  "，不随账号同步，换浏览器或清理站点数据后需重新设置。": [
    ", not synced with your account; set it again after switching browsers or clearing site data.",
    ", sem sincronizar com a conta; configure de novo ao trocar de navegador ou limpar os dados do site.",
  ],
  发送方式: ["Send mode", "Modo de envio"],
  // CHAT_SEND_MODE_OPTIONS labels (lib/chat-send-mode.ts), translated at display time
  "Enter 发送，Shift+Enter 换行": [
    "Enter to send, Shift+Enter for a new line",
    "Enter envia, Shift+Enter quebra linha",
  ],
  "Ctrl+Enter 发送，Enter 换行": ["Ctrl+Enter to send, Enter for a new line", "Ctrl+Enter envia, Enter quebra linha"],

  // ── Update card ──
  "检查更新失败：{error}": ["Update check failed: {error}", "Falha ao verificar atualizações: {error}"],
  "发现新版本 {version}": ["New version available: {version}", "Nova versão disponível: {version}"],
  当前已是最新版本: ["You're on the latest version", "Você já está na versão mais recente"],
  "已更新到 {version}，正在重新加载页面": [
    "Updated to {version}, reloading the page",
    "Atualizado para {version}, recarregando a página",
  ],
  "等待服务重启超时。请检查后端日志，或确认 artex 是通过 start.sh / start.bat 启动的。": [
    "Timed out waiting for the service to restart. Check the backend logs, or make sure artex was started via start.sh / start.bat.",
    "Tempo esgotado aguardando o serviço reiniciar. Verifique os logs do backend ou confirme que o artex foi iniciado via start.sh / start.bat.",
  ],
  "更新失败：{error}": ["Update failed: {error}", "Falha na atualização: {error}"],
  "确定更新到 {version}？": ["Update to {version}?", "Atualizar para {version}?"],
  "更新会重启程序，正在运行的任务会被中断。": [
    "The update restarts the program; running tasks will be interrupted.",
    "A atualização reinicia o programa; tarefas em execução serão interrompidas.",
  ],
  "注意：容器内更新只替换程序本身，不会更新镜像里的 playwright / nmap 等工具链；若新版本依赖新工具，请改用 docker compose pull。":
    [
      "Note: in-container updates only replace the program itself, not the toolchain in the image (playwright / nmap, etc.); if the new version needs new tools, use docker compose pull instead.",
      "Atenção: a atualização dentro do contêiner substitui só o programa, sem atualizar as ferramentas da imagem (playwright / nmap etc.); se a nova versão depender de novas ferramentas, use docker compose pull.",
    ],
  "准备中…": ["Preparing…", "Preparando…"],
  "启动更新失败：{error}": ["Failed to start the update: {error}", "Falha ao iniciar a atualização: {error}"],
  "回滚到上一版本？": ["Roll back to the previous version?", "Reverter para a versão anterior?"],
  "程序会重启，正在运行的任务会被中断。": [
    "The program will restart; running tasks will be interrupted.",
    "O programa será reiniciado; tarefas em execução serão interrompidas.",
  ],
  "注意：数据库结构不会回退，旧版本可能无法识别新版写入的数据。": [
    "Note: the database schema is not rolled back; the older version may not recognize data written by the newer one.",
    "Atenção: o esquema do banco de dados não é revertido; a versão anterior pode não reconhecer dados gravados pela nova.",
  ],
  "已切换到上一版本，正在重启…": [
    "Switched to the previous version, restarting…",
    "Versão anterior restaurada, reiniciando…",
  ],
  "回滚失败：{error}": ["Rollback failed: {error}", "Falha ao reverter: {error}"],
  版本与更新: ["Version & updates", "Versão e atualizações"],
  "从 GitHub 检查并安装新版本。更新会重启程序，正在运行的任务会被中断。": [
    "Check for and install new versions from GitHub. Updating restarts the program and interrupts running tasks.",
    "Verifique e instale novas versões a partir do GitHub. A atualização reinicia o programa e interrompe as tarefas em execução.",
  ],
  当前版本: ["Current version", "Versão atual"],
  独立程序: ["Standalone", "Executável"],
  最新版本: ["Latest version", "Versão mais recente"],
  更新日志: ["Changelog", "Changelog"],
  "无法连接 GitHub：{error}": ["Cannot reach GitHub: {error}", "Não foi possível conectar ao GitHub: {error}"],
  "可在上方配置全局代理后重试。": [
    "Configure the global proxy on this page and try again.",
    "Configure o proxy global nesta página e tente novamente.",
  ],
  "{latest} 没有提供 {platform} 的发布包（缺少 {asset}），无法自动更新。": [
    "{latest} has no release package for {platform} (missing {asset}); automatic update is not possible.",
    "{latest} não tem pacote de release para {platform} (falta {asset}); não é possível atualizar automaticamente.",
  ],
  将下载: ["Will download", "Será baixado"],
  "，校验 SHA256 并冒烟测试后才会替换，失败自动保留当前版本。": [
    ", replacing the current version only after SHA256 verification and a smoke test; on failure the current version is kept.",
    ", com substituição só após verificação de SHA256 e smoke test; se falhar, a versão atual é mantida.",
  ],
  "当前已是最新版本。": ["You're on the latest version.", "Você já está na versão mais recente."],
  "Docker 下的更新只替换程序本身，不更新镜像里的 playwright / nmap 等工具链，且": [
    "Under Docker, updates only replace the program itself, not the image's toolchain (playwright / nmap, etc.), and after",
    "No Docker, a atualização substitui só o programa, sem atualizar as ferramentas da imagem (playwright / nmap etc.), e depois que o",
  ],
  "重建容器后会退回镜像自带的版本。需要连镜像一起升级请执行": [
    "recreates the container, it reverts to the version bundled in the image. To upgrade the image as well, run",
    "recriar o contêiner, volta para a versão embutida na imagem. Para atualizar junto com a imagem, execute",
  ],
  "正在重启并应用新版本，请稍候（页面会自动刷新）…": [
    "Restarting and applying the new version, please wait (the page will refresh automatically)…",
    "Reiniciando e aplicando a nova versão, aguarde (a página será recarregada automaticamente)…",
  ],
  检查更新: ["Check for updates", "Verificar atualizações"],
  "更新到 {version}": ["Update to {version}", "Atualizar para {version}"],
  立即更新: ["Update now", "Atualizar agora"],
  回滚到上一版本: ["Roll back to previous version", "Reverter para a versão anterior"],
  "一键更新依赖守护脚本重启程序。请通过": [
    "One-click updates rely on the supervisor script to restart the program. Start ARTEX via",
    "A atualização com um clique depende do script supervisor para reiniciar o programa. Inicie o ARTEX via",
  ],
  "（Windows 为": [" (on Windows:", " (no Windows:"],
  "）启动 ARTEX；直接运行 artex 本体时，程序退出后不会被自动拉起。": [
    "); if you run the artex binary directly, it won't be relaunched after it exits.",
    "); se você executar o binário artex diretamente, ele não será reiniciado após encerrar.",
  ],

  // ── LLM page ──
  "不发送（默认）": ["Don't send (default)", "Não enviar (padrão)"],
  "关闭（disabled）": ["Off (disabled)", "Desativado (disabled)"],
  "开启（enabled）": ["On (enabled)", "Ativado (enabled)"],
  "max_tokens（默认）": ["max_tokens (default)", "max_tokens (padrão)"],
  "上限发哪个键。max_tokens 是默认，绝大多数兼容网关只认它；OpenAI 官方推理模型（o 系列 / GPT-5）反过来只认 max_completion_tokens，收到 max_tokens 会直接报 unsupported_parameter。":
    [
      "Which key carries the limit. max_tokens is the default and almost all compatible gateways only accept it; OpenAI's official reasoning models (o series / GPT-5) only accept max_completion_tokens and reject max_tokens with unsupported_parameter.",
      "Qual chave leva o limite. max_tokens é o padrão e quase todos os gateways compatíveis só aceitam ela; os modelos de raciocínio oficiais da OpenAI (série o / GPT-5) só aceitam max_completion_tokens e rejeitam max_tokens com unsupported_parameter.",
    ],
  "仅 openai 格式可选。Anthropic 的字段名固定为 max_tokens。": [
    "Only selectable for the openai format. Anthropic's field name is always max_tokens.",
    "Só pode ser escolhido no formato openai. No Anthropic o campo é sempre max_tokens.",
  ],
  "仅 openai 格式可选。Responses API 的字段名固定为 max_output_tokens。": [
    "Only selectable for the openai format. The Responses API field name is always max_output_tokens.",
    "Só pode ser escolhido no formato openai. Na Responses API o campo é sempre max_output_tokens.",
  ],
  "未配置 Key": ["No key configured", "Key não configurada"],
  "未填 API Key，无法调用": ["No API Key set; calls are not possible", "Sem API Key; não é possível fazer chamadas"],
  "已熔断 · {cooldown}": ["Tripped · {cooldown}", "Disjuntor aberto · {cooldown}"],
  已熔断: ["Tripped", "Disjuntor aberto"],
  "异常 · 失败 {n} 次": ["Degraded · {n} failures", "Instável · {n} falhas"],
  正常: ["Normal", "Normal"],
  "已开启 LLM 轮询": ["LLM rotation enabled", "Rodízio de LLM ativado"],
  "已关闭 LLM 轮询": ["LLM rotation disabled", "Rodízio de LLM desativado"],
  已更新兜底设置: ["Fallback setting updated", "Configuração de fallback atualizada"],
  "设置失败：{error}": ["Failed to apply setting: {error}", "Falha ao aplicar a configuração: {error}"],
  已恢复该配置: ["Profile restored", "Perfil restaurado"],
  已恢复全部配置: ["All profiles restored", "Todos os perfis restaurados"],
  "恢复失败：{error}": ["Restore failed: {error}", "Falha ao restaurar: {error}"],
  "LLM 轮询 · 故障转移": ["LLM rotation · Failover", "Rodízio de LLM · Failover"],
  "开启后，未指定模型的 Agent 在当前配置不可用（余额不足 / Key 失效 / 限流 / 服务异常）时自动切到下一个配置。": [
    "When on, Agents without a pinned model automatically switch to the next profile when the current one is unavailable (insufficient balance / invalid key / rate limited / service error).",
    "Quando ativado, os Agents sem modelo definido passam automaticamente para o próximo perfil quando o atual fica indisponível (saldo insuficiente / Key inválida / limite de taxa / falha no serviço).",
  ],
  启用轮询: ["Enable rotation", "Ativar rodízio"],
  "默认关闭。关闭时始终只用激活配置，失败即失败。": [
    "Off by default. When off, only the active profile is used and failures are final.",
    "Desativado por padrão. Quando desativado, usa sempre só o perfil ativo, sem fallback.",
  ],
  "LLM 轮询开关": ["LLM rotation toggle", "Alternar rodízio de LLM"],
  指定模型失败时也兜底: ["Fall back even when a pinned model fails", "Fallback também para modelo definido"],
  "默认关闭：Agent 或任务指定了某个配置就只用它，失败即失败（不会悄悄换成别的模型）。开启后，指定的配置失败时也会回落到下面的轮询链。":
    [
      "Off by default: if an Agent or task pins a profile, only that one is used and failures are final (no silent switch to another model). When on, a failing pinned profile also falls back to the rotation chain below.",
      "Desativado por padrão: se um Agent ou tarefa define um perfil, só ele é usado e falhas são definitivas (sem troca silenciosa de modelo). Quando ativado, o perfil definido que falhar também cai para a cadeia de rodízio abaixo.",
    ],
  绑定配置失败兜底开关: ["Pinned profile fallback toggle", "Alternar fallback de perfil definido"],
  轮询顺序: ["Rotation order", "Ordem do rodízio"],
  全部恢复: ["Restore all", "Restaurar todos"],
  "当前只有 {n} 个可用配置，轮询不会生效——至少需要 2 个已填 API Key 且参与轮询的配置。": [
    "Only {n} usable profile(s), so rotation won't take effect — at least 2 profiles with an API Key that take part in rotation are required.",
    "Apenas {n} perfil(is) utilizável(is), então o rodízio não terá efeito — são necessários pelo menos 2 perfis com API Key participando do rodízio.",
  ],
  激活: ["Active", "Ativo"],
  不参与轮询: ["Excluded from rotation", "Fora do rodízio"],
  "冷却 {time}": ["Cooldown {time}", "Cooldown {time}"],
  "连续失败 {n} 次": ["{n} consecutive failures", "{n} falhas seguidas"],
  立即恢复: ["Restore now", "Restaurar agora"],
  "立即恢复：清除熔断，下次调用重试该配置": [
    "Restore now: clear the circuit breaker and retry this profile on the next call",
    "Restaurar agora: limpa o disjuntor e tenta este perfil na próxima chamada",
  ],
  "优先级 {n}": ["Priority {n}", "Prioridade {n}"],
  暂无配置: ["No profiles", "Nenhum perfil"],
  "激活配置恒为第 1 顺位，其余按优先级从高到低（在各配置里设置）。某个配置失败后进入冷却（60s → 5min → 30min），冷却期内被跳过，恢复后自动切回。上下文窗口装不下当前请求的配置会被跳过。指定了模型的 Agent 与任务默认不参与轮询。":
    [
      "The active profile always comes first; the rest follow by priority, highest first (set in each profile). A failing profile enters cooldown (60s → 5min → 30min), is skipped during it, and is switched back automatically once it recovers. Profiles whose context window can't fit the current request are skipped. Agents and tasks with a pinned model don't use rotation by default.",
      "O perfil ativo é sempre o 1º; os demais seguem por prioridade, da maior para a menor (definida em cada perfil). Um perfil que falha entra em cooldown (60s → 5min → 30min), é ignorado nesse período e volta automaticamente ao se recuperar. Perfis cuja janela de contexto não comporta a requisição atual são ignorados. Agents e tarefas com modelo definido não participam do rodízio por padrão.",
    ],
  "已加载 {n} 个模型": ["Loaded {n} models", "{n} modelos carregados"],
  "加载模型失败：{error}": ["Failed to load models: {error}", "Falha ao carregar modelos: {error}"],
  未获取到模型: ["no models returned", "nenhum modelo retornado"],
  "加载模型出错：{error}": ["Error loading models: {error}", "Erro ao carregar modelos: {error}"],
  "连接成功 · {latency}ms · {model}": ["Connected · {latency}ms · {model}", "Conexão OK · {latency}ms · {model}"],
  "回复：{reply}": ["Reply: {reply}", "Resposta: {reply}"],
  "连接失败：{error}": ["Connection failed: {error}", "Falha na conexão: {error}"],
  "测试出错：{error}": ["Test error: {error}", "Erro no teste: {error}"],
  请填写名称与模型: ["Enter a name and a model", "Informe o nome e o modelo"],
  "已新建：{name}（在卡片上「设为激活」以启用）": [
    "Created: {name} (use “Set active” on its card to enable it)",
    "Criado: {name} (use “Ativar” no card para habilitar)",
  ],
  "已保存，激活配置即时生效，无需重启": [
    "Saved; the active profile applies immediately, no restart needed",
    "Salvo; o perfil ativo vale na hora, sem reiniciar",
  ],
  新建模型配置: ["New model profile", "Novo perfil de modelo"],
  "编辑：{name}": ["Edit: {name}", "Editar: {name}"],
  激活中: ["Active", "Ativo"],
  "新建后不会自动激活，请在卡片上「设为激活」以启用。": [
    "New profiles are not activated automatically; use “Set active” on the card to enable it.",
    "Novos perfis não são ativados automaticamente; use “Ativar” no card para habilitar.",
  ],
  "修改后点击保存；激活配置保存后对全部 Agent 立即生效。": [
    "Click Save after editing; changes to the active profile apply to all Agents immediately.",
    "Clique em Salvar após editar; alterações no perfil ativo valem para todos os Agents na hora.",
  ],
  "例如：OpenAI 生产": ["e.g. OpenAI production", "ex.: OpenAI produção"],
  格式: ["Format", "Formato"],
  选择格式: ["Select format", "Selecione o formato"],
  模型: ["Model", "Modelo"],
  "从 API 加载可用模型": ["Load available models from the API", "Carregar modelos disponíveis da API"],
  "Base URL（可选）": ["Base URL (optional)", "Base URL (opcional)"],
  "代理（可选）": ["Proxy (optional)", "Proxy (opcional)"],
  "仅 LLM 出站请求走此代理，支持 http/https/socks5，可带账号密码（如 socks5://user:pass@host:port，密码含特殊字符需 URL 编码）；留空表示不使用代理（直连）。":
    [
      "Only outbound LLM requests use this proxy. Supports http/https/socks5 with optional credentials (e.g. socks5://user:pass@host:port; URL-encode special characters in the password). Leave empty for no proxy (direct connection).",
      "Só as requisições de saída do LLM usam este proxy. Suporta http/https/socks5, com credenciais opcionais (ex.: socks5://user:pass@host:port; caracteres especiais na senha precisam de URL encoding). Deixe vazio para não usar proxy (conexão direta).",
    ],
  "自定义会话头（可选）": ["Custom session header (optional)", "Header de sessão personalizado (opcional)"],
  "如 x-session-id（留空=不发送）": ["e.g. x-session-id (empty = not sent)", "ex.: x-session-id (vazio = não enviar)"],
  "填写头名后，每次请求都会带上这个 HTTP 头，头值自动填为": [
    "Once set, every request carries this HTTP header, with its value automatically set to the",
    "Com o nome definido, toda requisição leva este header HTTP, com o valor preenchido automaticamente com o",
  ],
  "当前会话的 session id": ["current session's session id", "session id da sessão atual"],
  "（chat 会话如 conv-12、worker 如 exp3-worker-i87）。用于按 session-id 头做提示缓存 / 粘性路由的网关；同一会话多轮稳定、不同会话互不相同。留空则不发送。":
    [
      " (e.g. conv-12 for chat sessions, exp3-worker-i87 for workers). For gateways that do prompt caching / sticky routing by a session-id header; stable across the turns of one session and unique per session. Leave empty to not send it.",
      " (ex.: conv-12 em sessões de chat, exp3-worker-i87 em workers). Para gateways que fazem cache de prompt / roteamento fixo pelo header session-id; é estável entre os turnos de uma sessão e diferente entre sessões. Deixe vazio para não enviar.",
    ],
  "已设置（{hint}），留空保持不变": [
    "Set ({hint}); leave empty to keep it",
    "Definida ({hint}); deixe vazio para manter",
  ],
  每秒限速: ["Rate limit / sec", "Limite por segundo"],
  每分钟限速: ["Rate limit / min", "Limite por minuto"],
  "上下文窗口(K)": ["Context window (K)", "Janela de contexto (K)"],
  "限速 0 = 不限，全 Agent 共享。上下文窗口单位 K（千 token），0 = 默认 200K，上限 1000（即 1M）；设太高会导致压缩不触发。":
    [
      "Rate limit 0 = unlimited, shared by all Agents. Context window is in K (thousand tokens); 0 = default 200K, max 1000 (i.e. 1M). Setting it too high keeps compaction from triggering.",
      "Limite 0 = ilimitado, compartilhado por todos os Agents. Janela de contexto em K (mil tokens); 0 = padrão 200K, máximo 1000 (ou seja, 1M). Um valor alto demais impede que a compactação seja acionada.",
    ],
  轮询优先级: ["Rotation priority", "Prioridade no rodízio"],
  "数字越大越先被选中；激活配置恒为第 1 顺位，与本值无关。相同优先级的配置会轮流打头，天然分摊额度。": [
    "Higher numbers are picked first; the active profile always comes first regardless of this value. Profiles with equal priority take turns leading, spreading quota naturally.",
    "Números maiores são escolhidos primeiro; o perfil ativo é sempre o 1º, independentemente deste valor. Perfis com a mesma prioridade se revezam na frente, dividindo a cota naturalmente.",
  ],
  "开启后不会被当作故障转移目标（仍可被 Agent / 任务显式指定使用）。适合「只给某个 Agent 专用、不希望别人失败时烧掉」的昂贵配置。":
    [
      "When on, it is never used as a failover target (Agents / tasks can still pin it explicitly). Good for expensive profiles dedicated to one Agent that you don't want burned when others fail.",
      "Quando ativado, nunca é usado como destino de failover (Agents / tarefas ainda podem defini-lo explicitamente). Ideal para perfis caros dedicados a um Agent, que você não quer gastar quando outros falham.",
    ],
  "流式输出 · streaming": ["Streaming output", "Saída em streaming"],
  "开启（默认）走流式 SSE，有运行中实时进度与实时 token 计数。关闭则走真·非流式（stream:false，一次性返回完整响应）——可绕开部分网关糟糕的 SSE 实现（空帧 / 思考字段丢帧），代价是失去运行中的实时进度。":
    [
      "On (default) uses streaming SSE, with live progress and live token counts during runs. Off uses true non-streaming (stream:false, the full response at once) — this works around some gateways' broken SSE implementations (empty frames / dropped thinking fields), at the cost of live progress.",
      "Ativado (padrão) usa SSE em streaming, com progresso e contagem de tokens em tempo real. Desativado usa modo realmente sem streaming (stream:false, resposta completa de uma vez) — contorna implementações ruins de SSE em alguns gateways (frames vazios / campos de raciocínio perdidos), ao custo de perder o progresso em tempo real.",
    ],
  流式输出: ["Streaming output", "Saída em streaming"],
  "输出上限 · max tokens": ["Output limit · max tokens", "Limite de saída · max tokens"],
  "单次回复最多生成多少 token，随每次请求发出。0（默认）= 不发送该字段，由服务端默认值决定。这与上面的「上下文窗口」是两回事：那是模型总容量，只在本地用来算压缩阈值。设太小会让推理模型在思考阶段就被截断，一个字答案都出不来。":
    [
      "Maximum tokens generated per reply, sent with every request. 0 (default) = field not sent; the server default applies. This is not the “Context window” above: that is the model's total capacity, used only locally to compute the compaction threshold. Too small a value can cut reasoning models off while thinking, before they produce any answer.",
      "Máximo de tokens gerados por resposta, enviado em cada requisição. 0 (padrão) = campo não enviado; vale o padrão do servidor. Não confunda com a “Janela de contexto” acima: ela é a capacidade total do modelo, usada só localmente para calcular o limiar de compactação. Um valor pequeno demais pode cortar modelos de raciocínio ainda na fase de raciocínio, sem nenhuma resposta.",
    ],
  上限字段名: ["Limit field name", "Nome do campo de limite"],
  "思考开关 · thinking.type": ["Thinking toggle · thinking.type", "Raciocínio · thinking.type"],
  "控制是否发送 thinking 字段。不发送=不带该字段（兼容 MiniMax 等不支持的模型）；关闭=发 disabled；开启=发 enabled。与下面的强度互相独立。":
    [
      "Controls whether the thinking field is sent. Don't send = field omitted (for models like MiniMax that don't support it); Off = sends disabled; On = sends enabled. Independent of the effort below.",
      "Controla se o campo thinking é enviado. Não enviar = campo omitido (para modelos como MiniMax, que não o suportam); Desativado = envia disabled; Ativado = envia enabled. Independente da intensidade abaixo.",
    ],
  "思考强度 · reasoning_effort": [
    "Reasoning effort · reasoning_effort",
    "Intensidade de raciocínio · reasoning_effort",
  ],
  "独立的强度档位（OpenAI reasoning_effort / Anthropic output_config.effort）。有些接口没有 thinking 字段、只靠强度即可激活思考，故可单独设置、不发送思考开关。":
    [
      "Independent effort level (OpenAI reasoning_effort / Anthropic output_config.effort). Some APIs have no thinking field and enable thinking through effort alone, so it can be set on its own without sending the thinking toggle.",
      "Nível de intensidade independente (OpenAI reasoning_effort / Anthropic output_config.effort). Algumas APIs não têm o campo thinking e ativam o raciocínio só pela intensidade, então ele pode ser definido sozinho, sem enviar o campo thinking.",
    ],
  测试连接: ["Test connection", "Testar conexão"],
  "已激活：{name}": ["Activated: {name}", "Ativado: {name}"],
  "激活失败：{error}": ["Activation failed: {error}", "Falha ao ativar: {error}"],
  无法删除当前激活的配置: ["Can't delete the active profile", "Não é possível excluir o perfil ativo"],
  "全 Agent 共享的格式 / 模型 / 限速配置。点击卡片编辑，星标为当前激活配置。": [
    "Format / model / rate-limit profiles shared by all Agents. Click a card to edit; the star marks the active profile.",
    "Perfis de formato / modelo / limite compartilhados por todos os Agents. Clique em um card para editar; a estrela indica o perfil ativo.",
  ],
  轮询配置: ["Rotation settings", "Config. de rodízio"],
  模型配置: ["Model profiles", "Perfis de modelo"],
  重试与退避: ["Retry & backoff", "Retentativas e backoff"],
  "代理 {proxy}": ["Proxy {proxy}", "Proxy {proxy}"],
  "思考 {effort}": ["Thinking {effort}", "Raciocínio {effort}"],
  关: ["off", "desativado"],
  已激活: ["Active", "Ativo"],
  设为激活: ["Set active", "Ativar"],
  删除配置: ["Delete profile", "Excluir perfil"],
  "还没有模型配置，点击右上角「新建」创建第一个。": [
    "No model profiles yet. Click “New” at the top right to create the first one.",
    "Ainda não há perfis de modelo. Clique em “Novo” no canto superior direito para criar o primeiro.",
  ],

  // ── LLM retry layers ──
  建连重试: ["Connection retry", "Retentativa de conexão"],
  "SDK · 拿到 200 之前": ["SDK · before the 200", "SDK · antes do 200"],
  "连不上或还没拿到 200：连接重置 / 读写超时 / DNS 失败等网络层错误，以及 HTTP 408、429、500、502、503、504。": [
    "Can't connect or no 200 yet: connection reset / read-write timeout / DNS failure and other network errors, plus HTTP 408, 429, 500, 502, 503, 504.",
    "Sem conexão ou sem 200 ainda: conexão resetada / timeout de leitura-escrita / falha de DNS e outros erros de rede, além de HTTP 408, 429, 500, 502, 503, 504.",
  ],
  "其余状态码（400 / 401 / 403 / 404 / 413 / 422 等）都是确定性拒绝，重发也一样失败，直接上抛。": [
    "Other status codes (400 / 401 / 403 / 404 / 413 / 422, etc.) are deterministic rejections — resending fails the same way, so they propagate immediately.",
    "Os demais status (400 / 401 / 403 / 404 / 413 / 422 etc.) são rejeições determinísticas — reenviar falha do mesmo jeito, então o erro sobe direto.",
  ],
  "原样重发同一个请求。流一旦开始（已经拿到 200），中途断开就不归这层管了。": [
    "Resends the same request as-is. Once the stream has started (200 received), mid-stream drops are no longer handled here.",
    "Reenvia a mesma requisição sem alterações. Depois que o stream começa (200 recebido), quedas no meio não são tratadas aqui.",
  ],
  重试次数: ["Retries", "Retentativas"],
  "0.5s→1s→2s 指数（封顶 8s）": ["0.5s→1s→2s exponential (max 8s)", "0.5s→1s→2s exponencial (máx. 8s)"],
  "-1 = 一次都不重试，失败立刻上抛": ["-1 = never retry; fail immediately", "-1 = nunca retentar; falha na hora"],
  空响应重试: ["Empty response retry", "Retentativa de resposta vazia"],
  "SDK · 仅 openai 格式": ["SDK · openai format only", "SDK · só formato openai"],
  "HTTP 200、finish_reason 是正常 stop，但整条响应一个内容块都没有——网关空帧、思考字段丢帧、采样打嗝都会长这样。": [
    "HTTP 200 with a normal stop finish_reason, but the response has no content blocks at all — gateway empty frames, dropped thinking fields, or sampling hiccups look like this.",
    "HTTP 200 com finish_reason stop normal, mas a resposta não tem nenhum bloco de conteúdo — frames vazios do gateway, campos de raciocínio perdidos ou falhas de amostragem aparecem assim.",
  ],
  "因 max_tokens 截断而没有内容的不算（那要靠调高输出上限解决，重发只会再撞一次）。": [
    "Empty output caused by max_tokens truncation doesn't count (raise the output limit instead; resending would just hit it again).",
    "Saída vazia por truncamento de max_tokens não conta (aumente o limite de saída; reenviar só bateria no limite de novo).",
  ],
  "重发整个 prompt，所以在长上下文上比较贵，次数不宜给大。": [
    "Resends the whole prompt, so it is costly on long contexts; keep the count low.",
    "Reenvia o prompt inteiro, o que sai caro em contextos longos; mantenha o número baixo.",
  ],
  "-1 = 空响应直接原样交出": ["-1 = pass empty responses through as-is", "-1 = repassa a resposta vazia como está"],
  "同 provider 安全窗口重试": ["Same-provider safe-window retry", "Retentativa na janela segura (mesmo provider)"],
  "本项目 · 未交付输出前": ["ARTEX · before any output is delivered", "ARTEX · antes de entregar qualquer saída"],
  "流已经建立（拿到 200）之后才出问题：连接中途断开、供应商 overloaded、流内的 429 / 5xx 错误事件——且一个 token 都还没交给调用方。":
    [
      "Problems after the stream is established (200 received): mid-stream disconnects, provider overloaded, in-stream 429 / 5xx error events — with not a single token delivered to the caller yet.",
      "Problemas depois que o stream já foi estabelecido (200 recebido): desconexão no meio, provider overloaded, eventos de erro 429 / 5xx no stream — sem nenhum token entregue ao chamador ainda.",
    ],
  "额度耗尽（402 / insufficient_quota，交给轮询换配置）、上下文过长（413 / context length，交给压缩）、400 / 401 / 403 / 404 / 422 确定性拒绝，都不重试。":
    [
      "Quota exhausted (402 / insufficient_quota — rotation switches profiles), context too long (413 / context length — compaction handles it), and deterministic 400 / 401 / 403 / 404 / 422 rejections are not retried.",
      "Cota esgotada (402 / insufficient_quota — o rodízio troca de perfil), contexto longo demais (413 / context length — a compactação resolve) e rejeições determinísticas 400 / 401 / 403 / 404 / 422 não são retentadas.",
    ],
  "在同一个配置上重放同一个请求。因为还没交付任何输出，重放不会重复模型输出或工具执行。": [
    "Replays the same request on the same profile. Since no output was delivered yet, replaying never duplicates model output or tool execution.",
    "Repete a mesma requisição no mesmo perfil. Como nenhuma saída foi entregue, a repetição não duplica saída do modelo nem execução de ferramentas.",
  ],
  "0.5s→1s 指数（封顶 4s）": ["0.5s→1s exponential (max 4s)", "0.5s→1s exponencial (máx. 4s)"],
  "-1 = 断流直接交给外层的意图重跑": [
    "-1 = hand broken streams straight to the outer intent rerun",
    "-1 = stream interrompido vai direto para a reexecução de intenção",
  ],
  轮询熔断: ["Rotation circuit breaker", "Disjuntor do rodízio"],
  "本项目 · 进程级，全局一份": ["ARTEX · process-wide, global only", "ARTEX · nível de processo, só global"],
  "瞬时失败（429、5xx、网络错误）连续累计到阈值时熔断；余额不足（402）、密钥失效（401 / 403）、模型不存在（404）这类确定性失败不看阈值，第一次就熔断。":
    [
      "Trips when consecutive transient failures (429, 5xx, network errors) reach the threshold; deterministic failures such as insufficient balance (402), invalid key (401 / 403) or missing model (404) ignore the threshold and trip on the first occurrence.",
      "Abre quando falhas transitórias seguidas (429, 5xx, erros de rede) atingem o limite; falhas determinísticas como saldo insuficiente (402), chave inválida (401 / 403) ou modelo inexistente (404) ignoram o limite e abrem na primeira vez.",
    ],
  "成功一次即清零，所以偶尔抽风的配置不会被慢慢攒到熔断。": [
    "A single success resets the count, so occasionally flaky profiles don't slowly build up to a trip.",
    "Um sucesso zera a contagem, então perfis com falhas ocasionais não acumulam aos poucos até abrir o disjuntor.",
  ],
  "熔断后进入冷却，冷却期内轮询直接跳过这个配置。状态落库，重启不丢。": [
    "Once tripped it enters cooldown, and rotation skips the profile during it. State is persisted and survives restarts.",
    "Ao abrir, entra em cooldown e o rodízio ignora o perfil nesse período. O estado é salvo no banco e sobrevive a reinícios.",
  ],
  连续失败几次熔断: ["Consecutive failures to trip", "Falhas seguidas para abrir"],
  "1min→5min→30min 梯度": ["1min→5min→30min steps", "1min→5min→30min em degraus"],
  "-1 = 瞬时失败永不熔断（确定性失败仍然熔断）": [
    "-1 = transient failures never trip (deterministic failures still do)",
    "-1 = falhas transitórias nunca abrem o disjuntor (as determinísticas ainda abrem)",
  ],
  意图重跑: ["Intent rerun", "Reexecução de intenção"],
  "前面几层都没兜住：worker 以 model_error 收场——内层重试全部用尽，或者流已经开始交付输出后才断掉（那时重放不安全，只能整条重来）。":
    [
      "None of the inner layers caught it: the worker ended with model_error — inner retries exhausted, or the stream broke after output had started being delivered (replaying is unsafe then, so the whole thing restarts).",
      "Nenhuma camada interna segurou: o worker terminou com model_error — retentativas internas esgotadas, ou o stream caiu depois de já ter começado a entregar saída (aí repetir não é seguro, então tudo recomeça).",
    ],
  "额度耗尽已经由轮询换配置处理，不在这里重跑；任务被暂停 / 终止 / 进入收尾时立即让位，不占用退避时间。": [
    "Quota exhaustion is already handled by rotation switching profiles and isn't rerun here; when the task is paused / stopped / wrapping up, it yields immediately without waiting out the backoff.",
    "Cota esgotada já é tratada pelo rodízio trocando de perfil e não é reexecutada aqui; quando a tarefa é pausada / encerrada / entra em finalização, cede na hora, sem esperar o backoff.",
  ],
  "整条意图从头再跑一遍。它是最外层，一次重跑意味着里面几层的次数会再乘一遍。": [
    "Reruns the whole intent from scratch. It is the outermost layer — each rerun multiplies the inner layers' counts again.",
    "Reexecuta a intenção inteira do zero. É a camada mais externa — cada reexecução multiplica de novo as contagens das camadas internas.",
  ],
  重跑次数: ["Reruns", "Reexecuções"],
  "固定 3s": ["Fixed 3s", "Fixo 3s"],
  "-1 = 不重跑，该意图直接判为 blocked": [
    "-1 = no rerun; the intent is marked blocked",
    "-1 = sem reexecução; a intenção é marcada como blocked",
  ],
  触发: ["Trigger", "Gatilho"],
  不走这层: ["Not handled here", "Fora desta camada"],
  "默认 {n}": ["Default {n}", "Padrão {n}"],
  "间隔 ms": ["Interval ms", "Intervalo ms"],
  默认退避: ["Default backoff", "Backoff padrão"],
  "固定 {value}": ["Fixed {value}", "Fixo {value}"],
  "留空 = 用默认；{hint}。": ["Empty = default; {hint}.", "Vazio = padrão; {hint}."],
  重试覆盖: ["Retry overrides", "Sobrescrita de retentativas"],
  "只对这个配置生效，覆盖「重试与退避」里的全局默认。每格留空 = 跟随全局；次数填 -1 = 关掉这层重试；间隔填了就用固定间隔取代指数退避。熔断与意图重跑是进程级的，只能在全局那页调。":
    [
      "Applies only to this profile, overriding the global defaults in “Retry & backoff”. Empty field = follow global; count -1 = disable that layer; setting an interval replaces exponential backoff with a fixed interval. The circuit breaker and intent rerun are process-wide and can only be tuned on the global tab.",
      "Vale só para este perfil, sobrescrevendo os padrões globais de “Retentativas e backoff”. Campo vazio = segue o global; contagem -1 = desativa a camada; preencher o intervalo troca o backoff exponencial por um intervalo fixo. Disjuntor e reexecução de intenção são de nível de processo e só podem ser ajustados na aba global.",
    ],
  "读取重试策略失败：{error}": [
    "Failed to load retry policy: {error}",
    "Falha ao carregar a política de retentativas: {error}",
  ],
  "已保存，即时生效（正在跑的这一轮调用仍用旧参数）": [
    "Saved, effective immediately (calls already in flight keep the old settings)",
    "Salvo, vale na hora (chamadas em andamento mantêm os parâmetros antigos)",
  ],
  "读取重试策略…": ["Loading retry policy…", "Carregando política de retentativas…"],
  "一次模型调用的失败会依次经过五层重试，由内到外：": [
    "A failed model call passes through five retry layers, inner to outer:",
    "Uma chamada ao modelo que falha passa por cinco camadas de retentativa, de dentro para fora:",
  ],
  "建连 → 空响应 → 同 provider 安全窗口 → 轮询熔断 → 意图重跑": [
    "connection → empty response → same-provider safe window → rotation breaker → intent rerun",
    "conexão → resposta vazia → janela segura do mesmo provider → disjuntor do rodízio → reexecução de intenção",
  ],
  "。内层用尽才轮到外层，所以次数是": [
    ". Outer layers only kick in once inner ones are exhausted, so the counts ",
    ". As camadas externas só entram quando as internas se esgotam, então as contagens se ",
  ],
  相乘: ["multiply", "multiplicam"],
  "的——把每层都拉满，一次抖动能烧掉几十次请求。全部留空即当前默认值，与没有这页时的行为完全一致。前三层可以在每个模型配置里单独覆盖。":
    [
      " — max out every layer and a single glitch can burn dozens of requests. Leaving everything empty uses the current defaults, identical to the behavior before this page existed. The first three layers can be overridden per model profile.",
      " — com todas no máximo, uma única instabilidade pode queimar dezenas de requisições. Deixar tudo vazio usa os padrões atuais, idêntico ao comportamento antes desta página. As três primeiras camadas podem ser sobrescritas em cada perfil de modelo.",
    ],
  全部恢复默认: ["Reset all to defaults", "Restaurar todos os padrões"],

  // ── Logs page ──
  系统日志: ["System logs", "Logs do sistema"],
  "后端实时日志流(planner / worker / 数据库 / 流量 …)": [
    "Live backend log stream (planner / worker / database / traffic …)",
    "Stream de logs do backend em tempo real (planner / worker / banco de dados / tráfego …)",
  ],
  "过滤(文本 / tag)…": ["Filter (text / tag)…", "Filtrar (texto / tag)…"],
  已暂停: ["Paused", "Pausado"],
  暂停: ["Pause", "Pausar"],
  清空: ["Clear", "Limpar"],
  "{n} 行": ["{n} lines", "{n} linhas"],
  "{n} 警告": ["{n} warnings", "{n} avisos"],
  "{n} 错误": ["{n} errors", "{n} erros"],
  加载更早日志: ["Load older logs", "Carregar logs anteriores"],
  "暂无日志。": ["No logs yet.", "Nenhum log ainda."],

  // ── MCP page ──
  请填写名称: ["Enter a name", "Informe o nome"],
  请填写命令: ["Enter a command", "Informe o comando"],
  "请填写远程 URL": ["Enter the remote URL", "Informe a URL remota"],
  "已添加 MCP 服务器": ["MCP server added", "Servidor MCP adicionado"],
  "发现 {n} 个工具": ["Found {n} tools", "{n} ferramentas encontradas"],
  "刷新失败：{error}": ["Refresh failed: {error}", "Falha ao atualizar: {error}"],
  "操作失败：{error}": ["Action failed: {error}", "Falha na operação: {error}"],
  "取消「{name}」可见": ["Revoked visibility for “{name}”", "Visibilidade removida de “{name}”"],
  "授予「{name}」可见": ["Granted visibility to “{name}”", "Visibilidade concedida a “{name}”"],
  传输方式: ["Transport", "Transporte"],
  "stdio（本地）": ["stdio (local)", "stdio (local)"],
  "http（远程）": ["http (remote)", "http (remoto)"],
  "sse（旧版）": ["sse (legacy)", "sse (legado)"],
  命令: ["Command", "Comando"],
  "参数（空格分隔）": ["Arguments (space-separated)", "Argumentos (separados por espaço)"],
  "远程 URL": ["Remote URL", "URL remota"],
  "跳过 TLS 证书校验（自签证书）": [
    "Skip TLS certificate verification (self-signed certificate)",
    "Ignorar verificação do certificado TLS (certificado autoassinado)",
  ],
  "请求头（每行 KEY=VALUE，如 Authorization=Bearer xxx）": [
    "Request headers (one KEY=VALUE per line, e.g. Authorization=Bearer xxx)",
    "Headers da requisição (um KEY=VALUE por linha, ex.: Authorization=Bearer xxx)",
  ],
  "环境变量（每行 KEY=VALUE）": [
    "Environment variables (one KEY=VALUE per line)",
    "Variáveis de ambiente (um KEY=VALUE por linha)",
  ],
  "{n} 个工具": ["{n} tools", "{n} ferramentas"],
  "尚未发现工具，点击刷新重新获取。": [
    "No tools discovered yet. Click Refresh to fetch them.",
    "Nenhuma ferramenta encontrada ainda. Clique em Atualizar para buscar.",
  ],
  "外部 MCP 工具服务器 · 按 Agent 授权可见": [
    "External MCP tool servers · visibility granted per Agent",
    "Servidores MCP externos de ferramentas · visibilidade concedida por Agent",
  ],
  "添加 MCP": ["Add MCP", "Adicionar MCP"],
  尚未发现工具: ["No tools discovered yet", "Nenhuma ferramenta encontrada"],
  "可见性（按 Agent 授权）": ["Visibility (granted per Agent)", "Visibilidade (concedida por Agent)"],
  "添加 MCP 服务器": ["Add MCP server", "Adicionar servidor MCP"],
  "stdio（本地起进程）或 http（远程 Streamable HTTP）": [
    "stdio (local process) or http (remote Streamable HTTP)",
    "stdio (processo local) ou http (Streamable HTTP remoto)",
  ],
  配置: ["Configuration", "Configuração"],
  工具列表: ["Tools", "Ferramentas"],
  添加: ["Add", "Adicionar"],
  "Agent 输出语言": ["Agent output language", "Idioma de saída dos agentes"],
  "Agent 撰写对话回复、漏洞摘要、报告等人类可读内容时使用的语言。工具名、命令、payload 与流量原文保持不变。对下一轮生效。":
    [
      "Language agents use for human-readable output: chat replies, finding summaries, reports. Tool names, commands, payloads and raw traffic stay verbatim. Applies from the next turn.",
      "Idioma que os agentes usam no conteúdo legível: respostas no chat, resumos de achados, relatórios. Nomes de ferramentas, comandos, payloads e tráfego bruto permanecem como estão. Vale a partir da próxima rodada.",
    ],
  "已保存 Agent 输出语言（下一轮生效）": [
    "Agent output language saved (applies from the next turn)",
    "Idioma de saída dos agentes salvo (vale a partir da próxima rodada)",
  ],
};

export default messages;
