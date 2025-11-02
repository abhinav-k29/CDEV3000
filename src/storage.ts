import { LearningModule } from './App';

// User-specific storage keys (prefixed with userId)
const getUserModulesKey = (userId: string) => `userModules-${userId}`;
const getUserBranchesKey = (userId: string) => `userBranches-${userId}`;
const getChatRoomsKey = () => 'moduleChatRooms'; // Shared across all users
const getActivitiesKey = () => 'teamActivities'; // Shared across all users

export function loadUserModules(userId?: string): LearningModule[] | null {
  // If no userId provided, return empty (should not happen, but handle gracefully)
  if (!userId) return null;
  
  try {
    const key = getUserModulesKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LearningModule[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveUserModules(modules: LearningModule[], userId?: string): void {
  if (!userId) return;
  
  try {
    const key = getUserModulesKey(userId);
    localStorage.setItem(key, JSON.stringify(modules));
  } catch {
    // ignore write errors
  }
}

export function addModuleToUserPath(module: LearningModule, userId?: string): void {
  if (!userId) return;
  
  const existing = loadUserModules(userId) ?? [];
  const alreadyExists = existing.some(m => m.id === module.id);
  if (alreadyExists) {
    saveUserModules(existing, userId);
    return;
  }
  const normalized: LearningModule = { ...module };
  saveUserModules([normalized, ...existing], userId);
}

export function saveOrUpdateUserModule(module: LearningModule, userId?: string): void {
  if (!userId) return;
  const existing = loadUserModules(userId) ?? [];
  const idx = existing.findIndex(m => m.id === module.id);
  if (idx >= 0) {
    const updated = [...existing];
    updated[idx] = { ...existing[idx], ...module };
    saveUserModules(updated, userId);
  } else {
    saveUserModules([module, ...existing], userId);
  }
}

export function updateModuleProgress(moduleId: string, newProgress: number, userId?: string, base?: LearningModule): void {
  if (!userId) return;
  const existing = loadUserModules(userId) ?? [];
  const idx = existing.findIndex(m => m.id === moduleId);
  if (idx >= 0) {
    const updated = [...existing];
    updated[idx] = { ...updated[idx], progress: newProgress };
    saveUserModules(updated, userId);
    return;
  }
  if (base) {
    const created: LearningModule = { ...base, progress: newProgress };
    saveUserModules([created, ...existing], userId);
  }
}

export function removeModuleFromUserPath(moduleId: string, userId?: string): void {
  if (!userId) return;
  const existing = loadUserModules(userId) ?? [];
  const filtered = existing.filter(m => m.id !== moduleId);
  saveUserModules(filtered, userId);
}

export function resetCompletedToInProgress(userId?: string, progressFallback = 80): void {
  if (!userId) return;
  const existing = loadUserModules(userId) ?? [];
  if (existing.length === 0) return;
  const updated = existing.map(m => (m.progress === 100 ? { ...m, progress: progressFallback } : m));
  saveUserModules(updated, userId);
}

// Branch-related storage keys
const BRANCHES_KEY = 'userBranches';
const CHAT_ROOMS_KEY = 'moduleChatRooms';

// Generate auto branch name: lowercase username-module-title-version
function generateBranchName(userName: string, moduleTitle: string, existingBranches: string[]): string {
  const baseName = `${userName.toLowerCase().replace(/\s+/g, '-')}-${moduleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const matchingBranches = existingBranches.filter(b => b.startsWith(baseName));
  const version = matchingBranches.length > 0 ? `-v${matchingBranches.length + 1}` : '';
  return `${baseName}${version}`;
}

// Generate chat room ID from source module ID (shared across all users of same source module)
function getChatRoomId(sourceModuleId: string): string {
  return `chat-${sourceModuleId}`;
}

// Create a branch from a module
export function createBranch(
  sourceModule: LearningModule,
  userId: string,
  userName: string
): LearningModule | null {
  // Check if user already has a branch from this source module
  const userBranches = getUserBranches(userId);
  const sourceModuleId = sourceModule.id;
  const existingBranch = userBranches.find(
    b => b.sourceModuleId === sourceModuleId || b.parentModule === sourceModuleId
  );
  
  if (existingBranch) {
    // User already has a branch from this module
    return null;
  }
  
  const existing = loadUserModules(userId) ?? [];
  const allBranches = getAllBranches();
  const existingBranchNames = allBranches.map(b => b.branchName || '').filter(Boolean);
  
  const branchName = generateBranchName(userName, sourceModule.title, existingBranchNames);
  const branchId = `branch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const branchedModule: LearningModule = {
    ...sourceModule,
    id: `${branchId}-module-${Date.now()}`,
    branchId,
    branchOwnerId: userId,
    branchName,
    sourceModuleId,
    isBranched: true,
    parentModule: sourceModule.id,
    isPublic: true,
    progress: 0, // Reset progress when branching
    chatRoomId: getChatRoomId(sourceModuleId),
  };

  // Save to user's modules
  saveUserModules([branchedModule, ...existing], userId);
  
  // Save branch metadata
  saveBranchMetadata(branchedModule);
  
  // Log activity
  logBranchActivity(branchedModule, userId, userName);
  
  return branchedModule;
}

// Pull a module from someone's branch (creates independent copy)
export function pullFromBranch(
  branchModule: LearningModule,
  userId: string
): LearningModule {
  const existing = loadUserModules(userId) ?? [];
  const pulledModule: LearningModule = {
    ...branchModule,
    id: `pulled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    branchId: undefined, // Remove branch ID - it's now in user's personal path
    branchOwnerId: undefined,
    branchName: undefined,
    pulledFrom: branchModule.branchId,
    progress: 0, // Reset progress
    // Keep chatRoomId so users can chat together
    chatRoomId: branchModule.chatRoomId || getChatRoomId(branchModule.sourceModuleId || branchModule.id),
  };

  saveUserModules([pulledModule, ...existing], userId);
  
  return pulledModule;
}

// Get all branches for a specific user
export function getUserBranches(userId: string): LearningModule[] {
  const allBranches = getAllBranches();
  return allBranches.filter(b => b.branchOwnerId === userId);
}

// Get all visible branches from team (public branches)
export function getTeamBranches(excludeUserId?: string): LearningModule[] {
  const allBranches = getAllBranches();
  return allBranches.filter(b => 
    b.isPublic !== false && // Default to visible
    b.branchId && // Must be a branch
    b.branchOwnerId !== excludeUserId // Optionally exclude current user
  );
}

// Internal: Get all branches from storage
function getAllBranches(): LearningModule[] {
  try {
    const raw = localStorage.getItem(BRANCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LearningModule[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Internal: Save branch metadata
function saveBranchMetadata(branch: LearningModule): void {
  try {
    const existing = getAllBranches();
    const existingIndex = existing.findIndex(b => b.branchId === branch.branchId);
    
    if (existingIndex >= 0) {
      existing[existingIndex] = branch;
    } else {
      existing.push(branch);
    }
    
    localStorage.setItem(BRANCHES_KEY, JSON.stringify(existing));
  } catch {
    // ignore write errors
  }
}

// Get chat room messages for a module
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
}

export function getChatRoomMessages(chatRoomId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_ROOMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, ChatMessage[]>;
    const messages = parsed[chatRoomId] || [];
    // Convert timestamp strings back to Date objects
    return messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  } catch {
    return [];
  }
}

// Add message to chat room
export function addChatMessage(chatRoomId: string, message: ChatMessage): void {
  try {
    const raw = localStorage.getItem(CHAT_ROOMS_KEY);
    const rooms: Record<string, ChatMessage[]> = raw ? JSON.parse(raw) : {};
    
    if (!rooms[chatRoomId]) {
      rooms[chatRoomId] = [];
    }
    
    rooms[chatRoomId].push(message);
    localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));
  } catch {
    // ignore write errors
  }
}

// Activity tracking
const ACTIVITIES_KEY = 'teamActivities';

export interface ActivityItem {
  id: string;
  type: 'branch' | 'pull' | 'merge' | 'comment' | 'star' | 'complete';
  userId: string;
  userName: string;
  userAvatar?: string;
  targetModuleId?: string;
  targetModuleTitle?: string;
  branchId?: string;
  branchName?: string;
  timestamp: Date;
}

export function logActivity(activity: Omit<ActivityItem, 'id' | 'timestamp'>): void {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    const activities: ActivityItem[] = raw ? JSON.parse(raw) : [];
    
    const newActivity: ActivityItem = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    
    activities.unshift(newActivity); // Add to beginning (most recent first)
    
    // Keep only last 100 activities
    const trimmed = activities.slice(0, 100);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore write errors
  }
}

export function getActivities(limit = 20): ActivityItem[] {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    if (!raw) return [];
    const activities: ActivityItem[] = JSON.parse(raw);
    // Convert timestamp strings back to Date objects
    return activities.slice(0, limit).map(activity => ({
      ...activity,
      timestamp: new Date(activity.timestamp),
    }));
  } catch {
    return [];
  }
}

export function logBranchActivity(module: LearningModule, userId: string, userName: string): void {
  logActivity({
    type: 'branch',
    userId,
    userName,
    targetModuleId: module.sourceModuleId || module.id,
    targetModuleTitle: module.title,
    branchId: module.branchId,
    branchName: module.branchName,
  });
}

export function logPullActivity(branchModule: LearningModule, userId: string, userName?: string): void {
  logActivity({
    type: 'pull',
    userId,
    userName: userName || 'Unknown User',
    targetModuleId: branchModule.sourceModuleId || branchModule.id,
    targetModuleTitle: branchModule.title,
    branchId: branchModule.branchId,
    branchName: branchModule.branchName,
  });
}


