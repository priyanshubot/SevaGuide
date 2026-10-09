
export interface AIContext {
  activeServiceId?: string;
  activeServiceName?: string;
  currentStep?: string;
  verificationIssues?: string[];
}

export async function askSevaGuide(question: string, context?: AIContext): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const q = question.toLowerCase();

  if (q.includes('document') || q.includes('need') || q.includes('require')) {
    return `For ${context?.activeServiceName || 'government services'}, you generally need: 1) Proof of Identity (POI), 2) Proof of Address (POA), and 3) A recent passport photograph. Always ensure names match exactly across all cards.`;
  }

  if (q.includes('warning') || q.includes('address') || q.includes('mismatch')) {
    return `If you see an address warning, verify if your recent utility bill has a different street layout than your Aadhaar card. You can submit an official Gazette notification or a self-declaration affidavit if required.`;
  }

  if (q.includes('where') || q.includes('office') || q.includes('submit')) {
    return `You can submit your documents online via official government portals, or visit the nearest facilitation office. Check our "Find Office" tab to locate nearest centers with direction assistance.`;
  }

  return `I am SevaGuide AI assistant. I can help guide you through document preparation, pre-submission checks, and locating official government service centers for ${context?.activeServiceName || 'your application'}.`;
}