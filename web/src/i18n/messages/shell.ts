import type { Messages } from "../types";

// { "<zh source>": ["<en>", "<pt-BR>"] }
// App shell: auth pages, header/sidebar, navigation, shared table/copy widgets, API errors.
const messages: Messages = {
  // lib/api.ts
  未授权: ["Unauthorized", "Não autorizado"],
  "上传失败: {status}": ["Upload failed: {status}", "Falha no upload: {status}"],
  "上传失败: {status} {detail}": ["Upload failed: {status} {detail}", "Falha no upload: {status} {detail}"],
  "上传失败({status})": ["Upload failed ({status})", "Falha no upload ({status})"],
  "下载失败: {status}": ["Download failed: {status}", "Falha no download: {status}"],
  下载失败: ["Download failed", "Falha no download"],

  // config/app-config.ts
  自主渗透测试控制台: ["Autonomous Penetration Testing Console", "Console de Pentest Autônomo"],
  "LLM 驱动的自主渗透测试系统控制台": [
    "Console for an LLM-driven autonomous penetration testing system",
    "Console de um sistema de pentest autônomo orientado por LLM",
  ],

  // app/not-found.tsx
  "页面不存在。": ["Page not found.", "Página não encontrada."],
  "找不到你要访问的页面。": [
    "The page you are looking for could not be found.",
    "Não foi possível encontrar a página que você procura.",
  ],
  返回首页: ["Go back home", "Voltar ao início"],

  // login / setup
  无法连接到后端服务: ["Unable to connect to the backend service", "Não foi possível conectar ao serviço de backend"],
  "请先阅读并同意《使用须知》": [
    "Please read and accept the Terms of Use first",
    "Leia e aceite os Termos de Uso primeiro",
  ],
  用户名或密码错误: ["Incorrect username or password", "Usuário ou senha incorretos"],
  "正在检查登录状态…": ["Checking sign-in status…", "Verificando status do login…"],
  登录: ["Sign in", "Entrar"],
  "登录中...": ["Signing in...", "Entrando..."],
  "欢迎回来，请输入密码以继续使用 ARTEX": [
    "Welcome back. Enter your password to continue to ARTEX",
    "Bem-vindo de volta. Digite sua senha para continuar no ARTEX",
  ],
  用户名: ["Username", "Usuário"],
  密码: ["Password", "Senha"],
  请输入密码: ["Enter your password", "Digite sua senha"],
  我已阅读并同意: ["I have read and agree to the", "Li e concordo com os"],
  "《使用须知》": ["Terms of Use", "Termos de Uso"],
  "ARTEX 使用须知与免责声明": [
    "ARTEX Terms of Use and Disclaimer",
    "Termos de Uso e Isenção de Responsabilidade do ARTEX",
  ],
  "版本 v1.0 · 生效日期 2026-09-18 · 请在登录前完整阅读以下全部条款": [
    "Version v1.0 · Effective 2026-09-18 · Please read all of the terms below before signing in",
    "Versão v1.0 · Vigente desde 2026-09-18 · Leia todos os termos abaixo antes de entrar",
  ],
  '本《使用须知与免责声明》（以下简称"本声明"）是您与 ARTEX 项目作者及贡献者之间就使用本软件所达成的约定。请您在使用前审慎阅读、充分理解各条款内容，特别是以粗体或色块标注的免责、责任限制及禁止性条款。':
    [
      'These Terms of Use and Disclaimer (the "Terms") are an agreement between you and the authors and contributors of the ARTEX project regarding your use of this software. Before using it, read carefully and make sure you fully understand every clause, especially the disclaimer, limitation of liability and prohibition clauses marked in bold or highlighted.',
      'Estes Termos de Uso e Isenção de Responsabilidade (os "Termos") constituem um acordo entre você e os autores e colaboradores do projeto ARTEX sobre o uso deste software. Antes de usá-lo, leia com atenção e certifique-se de compreender plenamente cada cláusula, em especial as de isenção, limitação de responsabilidade e proibições destacadas em negrito ou em cor.',
    ],
  "一旦您下载、安装、访问或以任何方式使用本软件，即视为您已阅读、理解并同意接受本声明的全部约束。": [
    "By downloading, installing, accessing or using this software in any way, you are deemed to have read, understood and agreed to be bound by all of these Terms.",
    "Ao baixar, instalar, acessar ou usar este software de qualquer forma, considera-se que você leu, compreendeu e concordou em se vincular a todos estes Termos.",
  ],
  "第一条 · 定义与开源许可": [
    "Article 1 · Definitions and open-source license",
    "Cláusula 1 · Definições e licença de código aberto",
  ],
  "本软件（ARTEX）是一款基于 GNU Affero General Public License v3.0（AGPL-3.0）发布的开源程序。您可依据该协议自由使用、复制、修改和分发本软件；但任何衍生作品（包括通过网络向第三方提供的在线服务）均须同样以 AGPL-3.0 协议开源并向使用者公开对应的完整源代码。AGPL-3.0 完整条款以随附的 LICENSE 文件为准。":
    [
      "This software (ARTEX) is an open-source program released under the GNU Affero General Public License v3.0 (AGPL-3.0). Under that license you may freely use, copy, modify and distribute it; however, any derivative work (including online services offered to third parties over a network) must likewise be released under the AGPL-3.0 with its complete corresponding source code made available to its users. The full AGPL-3.0 terms are those in the accompanying LICENSE file.",
      "Este software (ARTEX) é um programa de código aberto distribuído sob a GNU Affero General Public License v3.0 (AGPL-3.0). Nos termos dessa licença, você pode usá-lo, copiá-lo, modificá-lo e distribuí-lo livremente; porém, qualquer obra derivada (incluindo serviços online oferecidos a terceiros pela rede) também deve ser disponibilizada sob a AGPL-3.0, com o código-fonte completo correspondente aberto aos seus usuários. Os termos completos da AGPL-3.0 são os do arquivo LICENSE que acompanha o software.",
    ],
  "第二条 · 授权使用范围": ["Article 2 · Permitted use", "Cláusula 2 · Escopo de uso permitido"],
  "本软件仅供个人学习、代码研究、安全技术原理探讨，以及在您自行搭建的本地隔离环境中进行技术验证之用，适用于学习、学术研究、代码审阅等非攻击性、非破坏性用途。除本条明确许可的情形外，您不得将本软件用于任何其他目的。":
    [
      "This software is intended solely for personal study, code research, discussion of security principles, and technical validation in an isolated local environment that you set up yourself; it is meant for non-offensive, non-destructive purposes such as learning, academic research and code review. You may not use it for any other purpose except as expressly permitted in this article.",
      "Este software destina-se exclusivamente a estudo pessoal, pesquisa de código, discussão de princípios de segurança e validação técnica em um ambiente local isolado montado por você; é voltado a finalidades não ofensivas e não destrutivas, como aprendizado, pesquisa acadêmica e revisão de código. Você não pode usá-lo para nenhuma outra finalidade além das expressamente permitidas nesta cláusula.",
    ],
  "第三条 · 禁止行为": ["Article 3 · Prohibited conduct", "Cláusula 3 · Condutas proibidas"],
  "严禁对任何网站、线上服务、他人或第三方所有的联网系统发起扫描、探测、利用或攻击（无论是否已获得授权、是否为您自有资产）；":
    [
      "Scanning, probing, exploiting or attacking any website, online service, or networked system owned by others or third parties is strictly prohibited (whether or not you are authorized, and whether or not the assets are your own);",
      "É estritamente proibido escanear, sondar, explorar ou atacar qualquer site, serviço online ou sistema conectado de outras pessoas ou de terceiros (com ou sem autorização, e sejam ou não ativos de sua propriedade);",
    ],
  "严禁将本软件用于任何实际的渗透测试、攻防对抗、红蓝演练或生产环境；": [
    "Using this software for any real-world penetration test, attack/defense exercise, red/blue team engagement or production environment is strictly prohibited;",
    "É estritamente proibido usar este software em qualquer pentest real, exercício de ataque e defesa, simulação red team/blue team ou ambiente de produção;",
  ],
  "严禁将本软件用于非法入侵、数据窃取、勒索、拒绝服务（DoS/DDoS）或任何破坏性、犯罪性活动；": [
    "Using this software for unauthorized intrusion, data theft, extortion, denial of service (DoS/DDoS) or any destructive or criminal activity is strictly prohibited;",
    "É estritamente proibido usar este software para invasão ilegal, roubo de dados, extorsão, negação de serviço (DoS/DDoS) ou qualquer atividade destrutiva ou criminosa;",
  ],
  "严禁移除、篡改或规避本软件及其输出中的任何版权、许可或安全提示信息；": [
    "Removing, altering or circumventing any copyright, license or security notice in this software or its output is strictly prohibited;",
    "É estritamente proibido remover, alterar ou contornar qualquer aviso de direitos autorais, licença ou segurança presente neste software ou em sua saída;",
  ],
  "严禁从事任何违反您所在国家或地区法律、法规及监管规定的行为。": [
    "Any conduct that violates the laws, regulations or regulatory requirements of your country or region is strictly prohibited.",
    "É estritamente proibida qualquer conduta que viole as leis, regulamentos ou normas regulatórias do seu país ou região.",
  ],
  "第四条 · 知识产权": ["Article 4 · Intellectual property", "Cláusula 4 · Propriedade intelectual"],
  "本软件的著作权及相关知识产权归项目作者及贡献者所有，并在 AGPL-3.0 协议约定的范围内向您授予相应权利。除该协议明确授予的权利外，本声明未以明示或默示方式授予您任何其他权利。":
    [
      "The copyright and related intellectual property rights in this software belong to the project's authors and contributors, who grant you the corresponding rights within the scope of the AGPL-3.0. Apart from the rights expressly granted by that license, these Terms grant you no other rights, express or implied.",
      "Os direitos autorais e demais direitos de propriedade intelectual deste software pertencem aos autores e colaboradores do projeto, que concedem a você os direitos correspondentes no escopo da AGPL-3.0. Além dos direitos expressamente concedidos por essa licença, estes Termos não concedem nenhum outro direito, expresso ou implícito.",
    ],
  "第五条 · 数据与隐私": ["Article 5 · Data and privacy", "Cláusula 5 · Dados e privacidade"],
  "本软件为可自行部署的开源程序，作者不运营任何集中式服务、亦不会收集或上传您的使用数据。您在使用过程中产生、处理或接触的一切数据，均由您自行掌控并负责其合法性与安全性；因数据处理不当引发的任何后果由您自行承担。":
    [
      "This software is a self-hosted open-source program; the authors operate no centralized service and do not collect or upload your usage data. You alone control all data you generate, process or access while using it, and you are responsible for its lawfulness and security; you bear any consequences of mishandling it.",
      "Este software é um programa de código aberto auto-hospedado; os autores não operam nenhum serviço centralizado nem coletam ou enviam seus dados de uso. Todos os dados que você gera, processa ou acessa durante o uso ficam sob seu controle, e você é responsável pela legalidade e segurança deles; quaisquer consequências do tratamento inadequado desses dados são de sua responsabilidade.",
    ],
  "第六条 · 合规与法律责任": [
    "Article 6 · Compliance and legal liability",
    "Cláusula 6 · Conformidade e responsabilidade legal",
  ],
  "您应自行遵守所在国家或地区关于网络安全、数据安全与个人信息保护、计算机犯罪等方面的全部法律法规（在中国大陆包括但不限于《网络安全法》《数据安全法》《个人信息保护法》及相关司法解释）。":
    [
      "You must comply with all laws and regulations of your country or region on cybersecurity, data security, personal information protection, computer crime and related matters (in mainland China, including but not limited to the Cybersecurity Law, the Data Security Law, the Personal Information Protection Law and related judicial interpretations).",
      "Você deve cumprir todas as leis e regulamentos do seu país ou região sobre segurança cibernética, segurança de dados, proteção de dados pessoais, crimes informáticos e temas relacionados (na China continental, incluindo, entre outras, a Lei de Cibersegurança, a Lei de Segurança de Dados, a Lei de Proteção de Informações Pessoais e interpretações judiciais relacionadas).",
    ],
  "因您违反上述法律法规或本声明约定而产生的一切法律责任与后果，均由您本人独立承担，与本软件作者及贡献者无关。": [
    "You alone bear all legal liability and consequences arising from any violation of these laws and regulations or of these Terms; the authors and contributors of this software bear none.",
    "Toda responsabilidade legal e consequência decorrente da violação dessas leis e regulamentos ou destes Termos é exclusivamente sua, sem qualquer responsabilidade dos autores e colaboradores deste software.",
  ],
  "第七条 · 免责声明与责任限制": [
    "Article 7 · Disclaimer and limitation of liability",
    "Cláusula 7 · Isenção e limitação de responsabilidade",
  ],
  '本软件按"现状（AS IS）"与"现有（AS AVAILABLE）"状态提供，不附带任何明示或默示的担保，包括但不限于对适销性、特定用途适用性、准确性及不侵权的担保。在适用法律允许的最大范围内，本软件作者及贡献者不对因使用或无法使用本软件（无论使用方式是否得当）而导致的任何直接、间接、偶然、特殊或后果性损失承担责任，包括但不限于数据丢失、系统损坏、业务中断、利润损失或法律纠纷。':
    [
      'This software is provided "AS IS" and "AS AVAILABLE", without any warranty, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, accuracy and non-infringement. To the maximum extent permitted by applicable law, the authors and contributors are not liable for any direct, indirect, incidental, special or consequential damages arising from the use of or inability to use this software (whether or not it was used properly), including but not limited to data loss, system damage, business interruption, lost profits or legal disputes.',
      'Este software é fornecido "NO ESTADO EM QUE SE ENCONTRA" (AS IS) e "CONFORME DISPONÍVEL" (AS AVAILABLE), sem qualquer garantia, expressa ou implícita, incluindo, entre outras, garantias de comercialização, adequação a uma finalidade específica, precisão e não violação. Na máxima extensão permitida pela lei aplicável, os autores e colaboradores não se responsabilizam por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou da impossibilidade de uso deste software (adequado ou não), incluindo, entre outros, perda de dados, danos a sistemas, interrupção de negócios, lucros cessantes ou disputas judiciais.',
    ],
  "第八条 · 条款变更与最终解释": [
    "Article 8 · Changes and final interpretation",
    "Cláusula 8 · Alterações e interpretação final",
  ],
  "作者有权根据法律法规或项目发展需要不时更新本声明，更新后的版本将随项目发布并自公布之日起生效；您继续使用本软件即视为接受修订后的条款。在法律允许的范围内，本声明的最终解释权归项目作者所有。若本声明任一条款被认定为无效，不影响其余条款的效力。":
    [
      "The authors may update these Terms from time to time as required by law or by the project's development; the updated version is published with the project and takes effect on the date of publication, and continued use of the software constitutes acceptance of the revised Terms. To the extent permitted by law, the right of final interpretation of these Terms rests with the project's authors. If any clause is held invalid, the remaining clauses remain in effect.",
      "Os autores podem atualizar estes Termos periodicamente, conforme exigido por lei ou pela evolução do projeto; a versão atualizada é publicada com o projeto e entra em vigor na data de publicação, e o uso continuado do software implica aceitação dos Termos revisados. Na extensão permitida por lei, a interpretação final destes Termos cabe aos autores do projeto. Se qualquer cláusula for considerada inválida, as demais permanecem em vigor.",
    ],
  您已浏览全部条款: ["You have reviewed all the terms", "Você leu todos os termos"],
  请将条款滚动至底部后再确认: [
    "Scroll to the bottom of the terms to confirm",
    "Role os termos até o final para confirmar",
  ],
  我已阅读并同意全部条款: ["I have read and agree to all terms", "Li e concordo com todos os termos"],
  两次输入的密码不一致: ["The passwords do not match", "As senhas não coincidem"],
  "密码长度至少 8 位": ["Password must be at least 8 characters", "A senha deve ter pelo menos 8 caracteres"],
  初始化失败: ["Initialization failed", "Falha na inicialização"],
  无法确认初始化状态: [
    "Unable to confirm initialization status",
    "Não foi possível confirmar o status de inicialização",
  ],
  初始化密码: ["Set up password", "Definir senha inicial"],
  "后端或数据库暂时不可用。为避免覆盖实例上已有的密码，初始化入口已临时关闭——请恢复服务后重试。": [
    "The backend or database is temporarily unavailable. To avoid overwriting an existing password on this instance, setup is temporarily disabled — restore the service and try again.",
    "O backend ou o banco de dados está temporariamente indisponível. Para evitar sobrescrever uma senha já existente nesta instância, a configuração inicial foi desativada temporariamente — restabeleça o serviço e tente novamente.",
  ],
  "首次使用 ARTEX，请为账户设置一个登录密码（至少 8 位）": [
    "First time using ARTEX? Set a sign-in password for the account (at least 8 characters)",
    "Primeiro acesso ao ARTEX? Defina uma senha de login para a conta (mínimo de 8 caracteres)",
  ],
  重试: ["Retry", "Tentar novamente"],
  新密码: ["New password", "Nova senha"],
  "至少 8 位": ["At least 8 characters", "Mínimo de 8 caracteres"],
  确认密码: ["Confirm password", "Confirmar senha"],
  再次输入密码: ["Enter the password again", "Digite a senha novamente"],
  "保存中...": ["Saving...", "Salvando..."],
  设置密码并登录: ["Set password and sign in", "Definir senha e entrar"],

  // header / update badge
  "版本 · {version}": ["Version · {version}", "Versão · {version}"],
  "发现新版本 {latest}，点击前往更新": [
    "New version {latest} available, click to update",
    "Nova versão {latest} disponível, clique para atualizar",
  ],
  "新版本 {latest}": ["New version {latest}", "Nova versão {latest}"],
  新版本: ["New version", "Nova versão"],

  // account menu / change password
  修改密码: ["Change password", "Alterar senha"],
  退出登录: ["Sign out", "Sair"],
  请填写当前密码和新密码: ["Enter your current password and a new password", "Informe a senha atual e a nova senha"],
  两次输入的新密码不一致: ["The new passwords do not match", "As novas senhas não coincidem"],
  密码已修改: ["Password changed", "Senha alterada"],
  "修改失败：{error}": ["Change failed: {error}", "Falha ao alterar: {error}"],
  用户名固定为: ["The username is fixed as", "O nome de usuário é fixo:"],
  "。需先输入当前密码验证；修改后已签发的登录 token 仍有效直至过期。": [
    ". Enter your current password to verify; login tokens already issued remain valid until they expire.",
    ". Informe a senha atual para confirmar; os tokens de login já emitidos continuam válidos até expirarem.",
  ],
  当前密码: ["Current password", "Senha atual"],
  确认新密码: ["Confirm new password", "Confirmar nova senha"],
  取消: ["Cancel", "Cancelar"],
  "修改中…": ["Changing…", "Alterando…"],
  确认修改: ["Confirm change", "Confirmar alteração"],

  // sidebar navigation
  功能: ["Features", "Recursos"],
  仪表盘: ["Dashboard", "Painel"],
  对话: ["Chat", "Chat"],
  任务: ["Tasks", "Tarefas"],
  发现: ["Findings", "Achados"],
  流量: ["Traffic", "Tráfego"],
  工具执行: ["Tool executions", "Execuções de ferramentas"],
  "LLM 录制": ["LLM recordings", "Gravações de LLM"],
  资产: ["Assets", "Ativos"],
  资产同步: ["Asset sync", "Sincronização de ativos"],
  工作空间: ["Workspace", "Workspace"],
  系统: ["System", "Sistema"],
  工具: ["Tools", "Ferramentas"],
  通知推送: ["Notifications", "Notificações"],
  拦截规则: ["Intercept rules", "Regras de interceptação"],
  资产拦截: ["Asset intercept", "Interceptação de ativos"],
  审批记录: ["Approvals", "Aprovações"],
  日志: ["Logs", "Logs"],
  系统配置: ["Settings", "Configurações"],

  // shared widgets
  关闭: ["Close", "Fechar"],
  "按{label}倒序排序": ["Sort by {label}, descending", "Ordenar por {label}, decrescente"],
  "{label}当前正序，点击切换排序方向": [
    "{label}: ascending, click to change sort direction",
    "{label}: crescente, clique para inverter a ordenação",
  ],
  "{label}当前倒序，点击切换排序方向": [
    "{label}: descending, click to change sort direction",
    "{label}: decrescente, clique para inverter a ordenação",
  ],
  "条/页": ["per page", "por página"],
  "{from}–{to} / 共 {total} 条": ["{from}–{to} of {total}", "{from}–{to} de {total}"],
  "共 {n} 条": ["{n} total", "{n} no total"],
  上一页: ["Previous page", "Página anterior"],
  下一页: ["Next page", "Próxima página"],
  已复制: ["Copied", "Copiado"],
  复制: ["Copy", "Copiar"],
  "复制失败，请手动选择文本复制": [
    "Copy failed. Select the text and copy it manually",
    "Falha ao copiar. Selecione o texto e copie manualmente",
  ],
  "（空）": ["(empty)", "(vazio)"],
  "复制失败，请使用 Ctrl/Cmd+A 后复制": [
    "Copy failed. Press Ctrl/Cmd+A, then copy",
    "Falha ao copiar. Pressione Ctrl/Cmd+A e copie",
  ],
  关闭自动换行: ["Disable line wrapping", "Desativar quebra de linha"],
  开启自动换行: ["Enable line wrapping", "Ativar quebra de linha"],
  已复制报文: ["Message copied", "Mensagem copiada"],
  复制报文: ["Copy message", "Copiar mensagem"],
  "HTTP 报文代码": ["HTTP message source", "Código da mensagem HTTP"],
};

export default messages;
