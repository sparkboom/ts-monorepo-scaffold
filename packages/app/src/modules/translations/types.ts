export type Texts = object;
export type Locale = 'de' | 'es' | 'es-XL' | 'en' | 'fr' | 'fr-CA' | 'it' | 'ja' | 'pt' | 'qaT';
export type TextsDict = {
  [key: string]: string;
};
export type TextsCollection = {
  [locale in Locale]: TextsDict | undefined;
};
export interface TextEntry {
  key: string;
  values?: {
    [k: string]: string | number;
  };
}
