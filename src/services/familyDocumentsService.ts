import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  FamilyMember,
  FamilyDocument,
  FamilyMemberWithDocs,
  FamilySummaryStats,
  CompletionStatus
} from '../types/family';
import { DEMO_FAMILY_MEMBERS, DEMO_FAMILY_DOCUMENTS } from '../data/demoFamilyMembers';

const getStorageKeyMembers = (userId: string) => `sevaguide_family_members_${userId}`;
const getStorageKeyDocs = (userId: string) => `sevaguide_family_docs_${userId}`;

// Compute completion status for a family member
export const calculateMemberCompletionStatus = (docs: FamilyDocument[]): CompletionStatus => {
  if (!docs || docs.length === 0) return 'Empty';
  const hasAttention = docs.some((d) => d.status === 'Needs Attention');
  if (hasAttention) return 'Needs Attention';
  const allVerified = docs.every((d) => d.status === 'Verified');
  if (allVerified) return 'Complete';
  return 'In Progress';
};

// Generate next auto-incremented internal Management ID (e.g., FAM-2026-005)
export const generateNextManagementId = (existingMembers: FamilyMember[]): string => {
  const currentYear = new Date().getFullYear();
  const pattern = new RegExp(`^FAM-${currentYear}-(\\d+)$`);
  let maxSeq = 0;

  for (const m of existingMembers) {
    const match = m.management_id.match(pattern);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `FAM-${currentYear}-${nextSeq}`;
};

// Calculate summary stats
export const calculateFamilyStats = (members: FamilyMemberWithDocs[]): FamilySummaryStats => {
  let totalDocs = 0;
  let verifiedDocs = 0;
  let attentionDocs = 0;

  for (const m of members) {
    for (const d of m.documents) {
      totalDocs += 1;
      if (d.status === 'Verified') verifiedDocs += 1;
      if (d.status === 'Needs Attention') attentionDocs += 1;
    }
  }

  return {
    totalMembers: members.length,
    totalDocuments: totalDocs,
    verifiedDocuments: verifiedDocs,
    attentionDocuments: attentionDocs
  };
};

export class FamilyDocumentsService {
  // Load family members and documents (with Supabase query & LocalStorage offline demo fallback)
  static async loadFamilyData(userId: string): Promise<FamilyMemberWithDocs[]> {
    let rawMembers: FamilyMember[] = [];
    let rawDocs: FamilyDocument[] = [];
    let usedSupabase = false;

    if (isSupabaseConfigured()) {
      try {
        const [membersRes, docsRes] = await Promise.all([
          supabase
            .from('family_members')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true }),
          supabase
            .from('family_documents')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
        ]);

        if (!membersRes.error && membersRes.data && membersRes.data.length > 0) {
          rawMembers = membersRes.data as FamilyMember[];
          rawDocs = (docsRes.data || []) as FamilyDocument[];
          usedSupabase = true;
        }
      } catch (err) {
        console.warn('Supabase family table access error, falling back to local storage:', err);
      }
    }

    // Fallback to localStorage if Supabase has no data or tables not yet migrated
    if (!usedSupabase) {
      const storedMembers = localStorage.getItem(getStorageKeyMembers(userId));
      const storedDocs = localStorage.getItem(getStorageKeyDocs(userId));

      if (storedMembers) {
        try {
          rawMembers = JSON.parse(storedMembers);
        } catch {
          rawMembers = [];
        }
      }

      if (storedDocs) {
        try {
          rawDocs = JSON.parse(storedDocs);
        } catch {
          rawDocs = [];
        }
      }

      // If entirely empty, seed initial demonstration records for this citizen
      if (rawMembers.length === 0) {
        rawMembers = DEMO_FAMILY_MEMBERS.map((m) => ({
          ...m,
          user_id: userId
        }));
        rawDocs = DEMO_FAMILY_DOCUMENTS.map((d) => ({
          ...d,
          user_id: userId
        }));

        localStorage.setItem(getStorageKeyMembers(userId), JSON.stringify(rawMembers));
        localStorage.setItem(getStorageKeyDocs(userId), JSON.stringify(rawDocs));
      }
    }

    // Combine members with their documents
    const combined: FamilyMemberWithDocs[] = rawMembers.map((member) => {
      const memberDocs = rawDocs.filter((d) => d.family_member_id === member.id);
      return {
        ...member,
        documents: memberDocs,
        completion_status: calculateMemberCompletionStatus(memberDocs)
      };
    });

    return combined;
  }

  // Add a new family member
  static async addMember(
    userId: string,
    data: {
      full_name: string;
      relationship: string;
      date_of_birth?: string;
      email?: string;
      phone?: string;
      notes?: string;
    },
    existingMembers: FamilyMember[]
  ): Promise<FamilyMember> {
    const newId = `fam_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const managementId = generateNextManagementId(existingMembers);
    const now = new Date().toISOString();

    const newMember: FamilyMember = {
      id: newId,
      user_id: userId,
      management_id: managementId,
      full_name: data.full_name.trim(),
      relationship: data.relationship,
      date_of_birth: data.date_of_birth || undefined,
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      is_demo: false,
      created_at: now,
      updated_at: now
    };

    // Try Supabase insert
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('family_members').insert(newMember);
        if (error) console.warn('Supabase member insert failed:', error.message);
      } catch (err) {
        console.warn('Supabase member insert exception:', err);
      }
    }

    // Always update localStorage for resilience
    const current = this.getLocalMembers(userId);
    current.push(newMember);
    localStorage.setItem(getStorageKeyMembers(userId), JSON.stringify(current));

    return newMember;
  }

  // Edit existing family member
  static async updateMember(
    userId: string,
    memberId: string,
    updates: Partial<FamilyMember>
  ): Promise<void> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('family_members')
          .update({ ...updates, updated_at: now })
          .eq('id', memberId)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase member update exception:', err);
      }
    }

    const current = this.getLocalMembers(userId);
    const updated = current.map((m) =>
      m.id === memberId ? { ...m, ...updates, updated_at: now } : m
    );
    localStorage.setItem(getStorageKeyMembers(userId), JSON.stringify(updated));
  }

  // Delete family member and associated documents
  static async deleteMember(userId: string, memberId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('family_documents')
          .delete()
          .eq('family_member_id', memberId)
          .eq('user_id', userId);

        await supabase
          .from('family_members')
          .delete()
          .eq('id', memberId)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase member delete exception:', err);
      }
    }

    const currentMembers = this.getLocalMembers(userId).filter((m) => m.id !== memberId);
    const currentDocs = this.getLocalDocs(userId).filter((d) => d.family_member_id !== memberId);

    localStorage.setItem(getStorageKeyMembers(userId), JSON.stringify(currentMembers));
    localStorage.setItem(getStorageKeyDocs(userId), JSON.stringify(currentDocs));
  }

  // Add document metadata
  static async addDocument(
    userId: string,
    docData: Omit<FamilyDocument, 'id' | 'user_id' | 'updated_at'>
  ): Promise<FamilyDocument> {
    const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();

    const newDoc: FamilyDocument = {
      ...docData,
      id: docId,
      user_id: userId,
      uploaded_at: docData.uploaded_at || now,
      updated_at: now
    };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('family_documents').insert(newDoc);
        if (error) console.warn('Supabase document insert failed:', error.message);
      } catch (err) {
        console.warn('Supabase document insert exception:', err);
      }
    }

    const currentDocs = this.getLocalDocs(userId);
    currentDocs.push(newDoc);
    localStorage.setItem(getStorageKeyDocs(userId), JSON.stringify(currentDocs));

    return newDoc;
  }

  // Update document metadata
  static async updateDocument(
    userId: string,
    docId: string,
    updates: Partial<FamilyDocument>
  ): Promise<void> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('family_documents')
          .update({ ...updates, updated_at: now })
          .eq('id', docId)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase document update exception:', err);
      }
    }

    const currentDocs = this.getLocalDocs(userId);
    const updated = currentDocs.map((d) =>
      d.id === docId ? { ...d, ...updates, updated_at: now } : d
    );
    localStorage.setItem(getStorageKeyDocs(userId), JSON.stringify(updated));
  }

  // Delete document metadata
  static async deleteDocument(userId: string, docId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('family_documents')
          .delete()
          .eq('id', docId)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase document delete exception:', err);
      }
    }

    const currentDocs = this.getLocalDocs(userId).filter((d) => d.id !== docId);
    localStorage.setItem(getStorageKeyDocs(userId), JSON.stringify(currentDocs));
  }

  // Reset to initial demonstration dataset
  static resetToDemo(userId: string): FamilyMemberWithDocs[] {
    const rawMembers: FamilyMember[] = DEMO_FAMILY_MEMBERS.map((m) => ({
      ...m,
      user_id: userId
    }));
    const rawDocs: FamilyDocument[] = DEMO_FAMILY_DOCUMENTS.map((d) => ({
      ...d,
      user_id: userId
    }));

    localStorage.setItem(getStorageKeyMembers(userId), JSON.stringify(rawMembers));
    localStorage.setItem(getStorageKeyDocs(userId), JSON.stringify(rawDocs));

    return rawMembers.map((member) => {
      const memberDocs = rawDocs.filter((d) => d.family_member_id === member.id);
      return {
        ...member,
        documents: memberDocs,
        completion_status: calculateMemberCompletionStatus(memberDocs)
      };
    });
  }

  // Helper readers
  private static getLocalMembers(userId: string): FamilyMember[] {
    const raw = localStorage.getItem(getStorageKeyMembers(userId));
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private static getLocalDocs(userId: string): FamilyDocument[] {
    const raw = localStorage.getItem(getStorageKeyDocs(userId));
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
}
