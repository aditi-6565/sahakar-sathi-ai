import { SupportedLanguage } from '../types';
import { PageContent } from './content/types';
import { mrContent } from './content/mr';
import { hiContent } from './content/hi';
import { enContent } from './content/en';
import { guContent } from './content/gu';
import { taContent } from './content/ta';
import { teContent } from './content/te';
import { knContent } from './content/kn';
import { bnContent } from './content/bn';

export type { PageContent } from './content/types';

export const PAGE_CONTENTS: Record<SupportedLanguage, PageContent> = {
  mr: mrContent,
  hi: hiContent,
  en: enContent,
  gu: guContent,
  ta: taContent,
  te: teContent,
  kn: knContent,
  bn: bnContent,
};

export const getPageContent = (lang: SupportedLanguage): PageContent => {
  return PAGE_CONTENTS[lang] || PAGE_CONTENTS.en || PAGE_CONTENTS.mr;
};
