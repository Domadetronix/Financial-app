import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';

import { firestoreDb } from './firebase';
import { Expense, Group, GroupData, GroupMember, IncomeEntry } from '../types';

const db = () => {
  if (!firestoreDb) throw new Error('Firestore not initialized');
  return firestoreDb;
};

const groupRef = (groupId: string) => doc(db(), 'groups', groupId);
const groupDataRef = (groupId: string) => doc(db(), 'groups', groupId, 'appData', 'main');

// Алфавит без похожих символов: 0/O, 1/I/l, 8/B
const ALPHABET = 'ACDEFGHJKLMNPQRSTUVWXYZ234679';

export const generateInviteCode = (): string =>
  Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');

// ── Создание группы ───────────────────────────────────────────────────────────

export const createGroup = async (
  ownerTelegramId: string,
  ownerName: string,
  groupName: string,
  photoUrl?: string
): Promise<string> => {
  const member: GroupMember = { telegramId: ownerTelegramId, name: ownerName, photoUrl };
  if (!photoUrl) delete member.photoUrl;

  const groupDoc = await addDoc(collection(db(), 'groups'), {
    name: groupName,
    ownerTelegramId,
    inviteCode: generateInviteCode(),
    memberIds: [ownerTelegramId],
    members: [member],
    createdAt: new Date().toISOString()
  });

  const emptyData: GroupData = {
    incomeEntriesByMonth: {},
    expensesByMonth: {},
    monthlyIncomes: [],
    monthlyExpenses: []
  };
  await setDoc(groupDataRef(groupDoc.id), emptyData);

  return groupDoc.id;
};

// ── Подписки (real-time) ──────────────────────────────────────────────────────

export const subscribeToUserGroups = (
  userId: string,
  cb: (groups: Group[]) => void
): (() => void) => {
  const q = query(collection(db(), 'groups'), where('memberIds', 'array-contains', userId));
  return onSnapshot(q, snap => {
    const groups: Group[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Group));
    cb(groups);
  });
};

export const subscribeToGroupData = (
  groupId: string,
  cb: (data: GroupData | null) => void
): (() => void) => {
  return onSnapshot(groupDataRef(groupId), snap => {
    if (!snap.exists()) {
      cb(null);
      return;
    }
    const raw = snap.data() as Partial<GroupData>;
    cb({
      incomeEntriesByMonth: raw.incomeEntriesByMonth ?? {},
      expensesByMonth: raw.expensesByMonth ?? {},
      monthlyIncomes: raw.monthlyIncomes ?? [],
      monthlyExpenses: raw.monthlyExpenses ?? []
    });
  });
};

export const subscribeToGroup = (
  groupId: string,
  cb: (group: Group | null) => void
): (() => void) => {
  return onSnapshot(groupRef(groupId), snap => {
    if (!snap.exists()) {
      cb(null);
      return;
    }
    cb({ id: snap.id, ...snap.data() } as Group);
  });
};

// ── Сохранение данных (fire-and-forget) ───────────────────────────────────────

export const saveGroupData = (
  groupId: string,
  field: keyof GroupData,
  value: GroupData[keyof GroupData] | Record<string, Expense[]> | Record<string, IncomeEntry[]>
): void => {
  setDoc(groupDataRef(groupId), { [field]: value }, { merge: true });
};

// ── Вступление по invite-коду ─────────────────────────────────────────────────

export const joinGroupByInviteCode = async (
  code: string,
  member: GroupMember
): Promise<{ success: boolean; groupId?: string; error?: string }> => {
  const q = query(collection(db(), 'groups'), where('inviteCode', '==', code.toUpperCase()));
  const snap = await getDocs(q);

  if (snap.empty) {
    return { success: false, error: 'Группа не найдена' };
  }

  const groupDoc = snap.docs[0];
  const groupId = groupDoc.id;
  const data = groupDoc.data() as Group;

  if (data.memberIds.includes(member.telegramId)) {
    return { success: true, groupId };
  }

  // Читаем и обновляем members вручную (arrayUnion ненадёжен для объектов)
  const freshSnap = await getDoc(groupRef(groupId));
  const fresh = freshSnap.data() as Group;
  const newMember: GroupMember = { ...member };
  if (!newMember.photoUrl) delete newMember.photoUrl;

  await updateDoc(groupRef(groupId), {
    memberIds: [...fresh.memberIds, member.telegramId],
    members: [...fresh.members, newMember]
  });

  return { success: true, groupId };
};

// ── Управление группой ────────────────────────────────────────────────────────

export const updateGroupName = (groupId: string, name: string): void => {
  updateDoc(groupRef(groupId), { name });
};

export const removeMemberFromGroup = async (
  groupId: string,
  telegramId: string
): Promise<void> => {
  const snap = await getDoc(groupRef(groupId));
  const data = snap.data() as Group;
  await updateDoc(groupRef(groupId), {
    memberIds: data.memberIds.filter(id => id !== telegramId),
    members: data.members.filter(m => m.telegramId !== telegramId)
  });
};

export const leaveGroup = removeMemberFromGroup;

export const deleteGroup = async (groupId: string): Promise<void> => {
  await deleteDoc(groupDataRef(groupId));
  await deleteDoc(groupRef(groupId));
};
