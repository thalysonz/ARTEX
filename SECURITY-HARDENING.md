# Endurecimento de segurança deste fork

Este fork do ARTEX roda **apenas código auditado**. Três mudanças garantem isso:

1. o auto-update está desabilitado na compilação;
2. a imagem Docker é compilada localmente a partir deste código;
3. a instalação automática do ripgrep via npm está desligada.

---

## 1. Auto-update desabilitado

### Por quê

O commit upstream `f3e3f54` passou a buscar atualizações no repositório de terceiro
`Hinln/ARTEX`. O updater tinha dois problemas:

- **O SHA256 não protege contra o dono do repositório.** O arquivo `SHA256SUMS` vem do
  mesmo Release que o binário, então quem controla o repositório controla os dois.
- **O binário novo é executado durante a verificação.** O "smoke test" (`selfupdate/bootstrap.go`)
  roda o `artex.new` baixado antes de trocar a versão.

Reverter o commit só trocaria a origem por `Autumn-27/artex`, que também é de terceiro.
Por isso o updater foi **desligado**, não redirecionado.

### Como

[`selfupdate/enabled.go`](selfupdate/enabled.go):

```go
const Enabled = false
```

É uma **constante de compilação**. Não existe variável de ambiente nem opção na
interface que a religue.

| Onde | Efeito com `Enabled = false` |
|---|---|
| [`cmd/artex/main.go`](cmd/artex/main.go) | `selfupdate.Bootstrap()` e `Settle()` não rodam. Nenhum `artex.new` é executado, trocado ou revertido. |
| `GET /api/update/check` ([`server/update.go`](server/update.go)) | Responde localmente com `disabled: true`, **sem nenhuma requisição ao GitHub**. |
| `POST /api/update/apply` | Retorna `403`. |
| `POST /api/update/rollback` | Retorna `403`. |
| Página Configurações ([`update-card.tsx`](web/src/app/(main)/system/settings/_components/update-card.tsx)) | Esconde os botões de atualizar/reverter e mostra o aviso. |

### Como atualizar

Puxe o código novo, **revise o diff** e recompile a imagem (seção 2).

### Como verificar

```bash
grep -n "const Enabled" selfupdate/enabled.go           # deve mostrar: const Enabled = false
docker logs artex-artex-1 2>&1 | grep -c "\[update\]"   # deve ser 0
```

---

## 2. Build Docker local (nunca baixar a imagem pronta)

### Por quê

O `docker-compose.yml` original usa `image: autumn27/artex`, uma imagem do Docker Hub
com um binário pré-compilado que **não foi auditado**. O `Dockerfile` original também
espera um binário pronto em `dist/<arch>/artex`, gerado pelo CI upstream.

### Como

- [`Dockerfile.build`](Dockerfile.build): build em múltiplos estágios que compila tudo
  **a partir deste código**:
  1. `node:22-bookworm-slim`: `npm ci` (travado pelo `package-lock.json`) e `next build`
     (exportação estática);
  2. `golang:1.26-bookworm`: `go mod download` (verificado pelo `go.sum`) e `go build`
     com o frontend embutido;
  3. imagem final `python:3.12-slim-bookworm` com as ferramentas de recon e o binário
     recém-compilado.
- [`docker-compose.local.yml`](docker-compose.local.yml): override que troca a imagem
  por `artex:local` com `pull_policy: build`, então o Compose **nunca** baixa
  `autumn27/artex`.

### Uso

```bash
cp .env.example .env    # defina POSTGRES_PASSWORD
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

Sempre passe **os dois** arquivos `-f`. Rodar só `docker compose up` usa o
`docker-compose.yml` original, que baixa a imagem não auditada.

### O que ainda vem de registries públicos

As imagens base oficiais (`node`, `golang`, `python`, `postgres`), os pacotes `apt` e os
pacotes npm globais do Playwright (`@playwright/mcp`, `@playwright/cli`, `playwright`)
continuam vindo de registries públicos. As dependências do frontend e do Go são travadas
por `package-lock.json` e `go.sum`. Os pacotes do Playwright usam `@latest`; se quiser
reprodutibilidade total, fixe as versões no `Dockerfile.build`.

---

## 3. `NORMA_RIPGREP_NO_INSTALL=1`

### Por quê

A dependência `github.com/Autumn-27/norma` (ferramenta Grep dos agentes,
`tool/ripgrep.go`) roda `npm install -g @vscode/ripgrep` **em tempo de execução** quando
não encontra o binário `rg`. Isso baixaria e instalaria um pacote npm de dentro do
container em produção.

### Como

O `rg` já vem instalado pelo `apt` (`ripgrep`) no [`Dockerfile.build`](Dockerfile.build).
A variável impede a instalação automática e faz o norma usar o `rg` existente (ou o
fallback em Go puro):

- `ENV NORMA_RIPGREP_NO_INSTALL=1` no [`Dockerfile.build`](Dockerfile.build);
- `NORMA_RIPGREP_NO_INSTALL: "1"` no `environment` do
  [`docker-compose.local.yml`](docker-compose.local.yml).

### Como verificar

```bash
docker exec artex-artex-1 sh -c 'echo $NORMA_RIPGREP_NO_INSTALL'   # deve mostrar: 1
```

---

## Observações operacionais

- A porta `8787` é publicada em `0.0.0.0` (toda a rede), como no compose original.
  Restrinja com firewall ou troque para `127.0.0.1:8787:8787` se não precisar de acesso
  pela rede.
- O ARTEX grava `jwt.key` em `/app/jwt.key`, fora do volume `./data`. Toda recriação do
  container invalida as sessões e pede login de novo (comportamento upstream).
- `ARTEX_UPDATE_GITHUB_TOKEN` não tem efeito neste fork: o updater não roda.
