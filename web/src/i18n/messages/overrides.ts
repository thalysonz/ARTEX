import type { Messages } from "../types";

// Loaded last: settles keys that several area files translated differently.
// Prefer wording that works in every place the key appears.
const messages: Messages = {
  复测: ["Retest", "Reteste"],
  已超时: ["Timed out", "Tempo esgotado"],
  已暂停: ["Paused", "Pausado"],
  已完成: ["Completed", "Concluído"],
  已删除: ["Deleted", "Excluído"],
  已停止: ["Stopped", "Interrompido"],
  应用: ["App", "Aplicativo"],
  上一页: ["Previous page", "Página anterior"],
  下一页: ["Next page", "Próxima página"],
  "上传失败：{msg}": ["Upload failed: {msg}", "Falha no upload: {msg}"],
  保存失败: ["Save failed", "Falha ao salvar"],
};

export default messages;
