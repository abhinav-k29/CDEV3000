import { LearningModule } from './App';

const USER_MODULES_KEY = 'userModules';

export function loadUserModules(): LearningModule[] | null {
  try {
    const raw = localStorage.getItem(USER_MODULES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LearningModule[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveUserModules(modules: LearningModule[]): void {
  try {
    localStorage.setItem(USER_MODULES_KEY, JSON.stringify(modules));
  } catch {
    // ignore write errors
  }
}

export function addModuleToUserPath(module: LearningModule): void {
  const existing = loadUserModules() ?? [];
  const alreadyExists = existing.some(m => m.id === module.id);
  if (alreadyExists) {
    saveUserModules(existing);
    return;
  }
  const normalized: LearningModule = { ...module };
  saveUserModules([normalized, ...existing]);
}

export function saveOrUpdateUserModule(module: LearningModule): void {
  const existing = loadUserModules() ?? [];
  const idx = existing.findIndex(m => m.id === module.id);
  if (idx >= 0) {
    const updated = [...existing];
    updated[idx] = { ...existing[idx], ...module };
    saveUserModules(updated);
  } else {
    saveUserModules([module, ...existing]);
  }
}

export function updateModuleProgress(moduleId: string, newProgress: number, base?: LearningModule): void {
  const existing = loadUserModules() ?? [];
  const idx = existing.findIndex(m => m.id === moduleId);
  if (idx >= 0) {
    const updated = [...existing];
    updated[idx] = { ...updated[idx], progress: newProgress };
    saveUserModules(updated);
    return;
  }
  if (base) {
    const created: LearningModule = { ...base, progress: newProgress };
    saveUserModules([created, ...existing]);
  }
}


