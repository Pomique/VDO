export interface ThemeConfig {
  id: string;
  name: string;
  bgClass: string;
  bgColor: string;
  textClass: string;
  textColor: string;
  accentClass: string;
  accentColor: string;
  secondaryColor: string;
  cardBgClass: string;
  borderClass: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  'minimal-cream': {
    id: 'minimal-cream',
    name: 'Papier Crème & Rouge (Recommandé)',
    bgClass: 'bg-[#F9F7F2]',
    bgColor: '#F9F7F2',
    textClass: 'text-stone-900',
    textColor: '#1C1917',
    accentClass: 'text-rose-600',
    accentColor: '#E11D48',
    secondaryColor: '#0284C7',
    cardBgClass: 'bg-white shadow-sm',
    borderClass: 'border-stone-200',
  },
  'dark-slate': {
    id: 'dark-slate',
    name: 'Ardoise Sombre & Néon',
    bgClass: 'bg-[#0F172A]',
    bgColor: '#0F172A',
    textClass: 'text-slate-100',
    textColor: '#F8FAFC',
    accentClass: 'text-rose-400',
    accentColor: '#FB7185',
    secondaryColor: '#38BDF8',
    cardBgClass: 'bg-slate-900/80 border-slate-800',
    borderClass: 'border-slate-800',
  },
  'swiss-clean': {
    id: 'swiss-clean',
    name: 'Blanc Pur & Noir Minimal',
    bgClass: 'bg-white',
    bgColor: '#FFFFFF',
    textClass: 'text-neutral-900',
    textColor: '#171717',
    accentClass: 'text-red-600',
    accentColor: '#DC2626',
    secondaryColor: '#2563EB',
    cardBgClass: 'bg-neutral-50 border-neutral-200',
    borderClass: 'border-neutral-200',
  },
};
