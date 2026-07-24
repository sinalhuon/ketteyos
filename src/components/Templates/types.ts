export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  gradient?: string;
}

export interface Typography {
  headingFont: string;
  bodyFont: string;
  khmerFont: string;
  englishHeadingFont?: string;
  englishBodyFont?: string;
  englishButtonFont?: string;
  englishH1Font?: string;
  englishH2Font?: string;
  englishH3Font?: string;
  englishBodySizePx?: number;
  englishButtonSizePx?: number;
  englishH1SizePx?: number;
  englishH2SizePx?: number;
  englishH3SizePx?: number;
  englishBodyStyle?: 'normal' | 'bold' | 'italic';
  englishButtonStyle?: 'normal' | 'bold' | 'italic';
  englishH1Style?: 'normal' | 'bold' | 'italic';
  englishH2Style?: 'normal' | 'bold' | 'italic';
  englishH3Style?: 'normal' | 'bold' | 'italic';
  khmerHeadingFont?: string;
  khmerBodyFont?: string;
  khmerButtonFont?: string;
  khmerH1Font?: string;
  khmerH2Font?: string;
  khmerH3Font?: string;
  khmerBodySizePx?: number;
  khmerButtonSizePx?: number;
  khmerH1SizePx?: number;
  khmerH2SizePx?: number;
  khmerH3SizePx?: number;
  khmerBodyStyle?: 'normal' | 'bold' | 'italic';
  khmerButtonStyle?: 'normal' | 'bold' | 'italic';
  khmerH1Style?: 'normal' | 'bold' | 'italic';
  khmerH2Style?: 'normal' | 'bold' | 'italic';
  khmerH3Style?: 'normal' | 'bold' | 'italic';
  headingSize: string;
  bodySize: string;
  khmerSize: string;
  letterSpacing: string;
  textShadow?: string;
}

export interface AnimationConfig {
  entranceDuration: number;
  transitionStyle: string;
  hoverEffect: string;
  backgroundAnimation: string;
  particleEffect: boolean;
}

export interface BackgroundTreatment {
  type: 'video' | 'gradient' | 'pattern' | 'image';
  src?: string;
  gradient?: string;
  pattern?: string;
  opacity: number;
  blendMode?: string;
}

export interface ComponentArrangement {
  photoPosition: 'top' | 'center' | 'side' | 'background';
  textAlignment: 'left' | 'center' | 'right';
  buttonPosition: 'bottom' | 'floating' | 'side';
  sectionOrder: string[];
  spacing: 'compact' | 'normal' | 'spacious';
}

export type TemplatePageKey = 'intro' | 'transition' | 'details';

export interface TemplatePageConfig {
  colorScheme?: ColorScheme;
  typography?: Typography;
  animations?: AnimationConfig;
  background?: BackgroundTreatment;
  arrangement?: ComponentArrangement;
  openButtonTextColor?: string;
  transitionMode?: 'click' | 'auto' | 'video-end';
  autoAdvanceSeconds?: number;
  showGuestName?: boolean;
  showOverlay?: boolean;
  showSaveTheDate?: boolean;
  showEventTitle?: boolean;
  showNames?: boolean;
  showDate?: boolean;
  showLocation?: boolean;
  blocks?: TemplateBuilderBlock[];
}

export type TemplateBuilderBlockType =
  | 'event-type'
  | 'guest-name'
  | 'main-names'
  | 'date'
  | 'location'
  | 'button'
  | 'message'
  | 'logo';

export interface TemplateBuilderBlock {
  id: string;
  type: TemplateBuilderBlockType;
  label: string;
  visible: boolean;
  props: {
    text?: string;
    color?: string;
    backgroundColor?: string;
    fontFamily?: string;
    fontSize?: number;
    align?: 'left' | 'center' | 'right';
    weight?: 'normal' | 'medium' | 'bold';
    radius?: number;
    padding?: number;
  };
}

export interface StorySlide {
  id: string;
  imageUrl: string;
  title?: string;
  caption?: string;
  order?: number;
}

export interface MovieCredit {
  role: string;
  name: string;
  nameEn?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  layoutType: 'modern' | 'traditional' | 'romantic' | 'movie-ceremony' | 'default' | 'class-gold' | 'golden-grandeur' | 'blush-ornate' | 'birthday-balloon' | 'botanical-arch' | 'blue-arch';
  colorScheme: ColorScheme;
  typography: Typography;
  animations: AnimationConfig;
  background: BackgroundTreatment;
  arrangement: ComponentArrangement;
  customCSS?: string;
  showButtonText?: boolean;
  openButtonTextColor?: string;
  showIntroGuestName?: boolean;
  showTransitionOverlay?: boolean;
  showTransitionSaveTheDate?: boolean;
  showTransitionEventTitle?: boolean;
  showTransitionNames?: boolean;
  showTransitionDate?: boolean;
  showTransitionLocation?: boolean;
  transitionDurationSeconds?: number;
  storySlides?: StorySlide[];
  movieCredits?: MovieCredit[];
  movieTitle?: string;
  movieTitleEn?: string;
  movieSummary?: string;
  directorName?: string;
  directorNameEn?: string;
  productionLogoUrl?: string;
  movieTrailerUrl?: string;
  dressCode?: string;
  dressCodeText?: string;
  dressCodeColors?: string[];
  mainSponsorLogos?: string[];
  cooperateSponsorLogos?: string[];
  pages?: Partial<Record<TemplatePageKey, TemplatePageConfig>>;
}

export type LayoutType = 'modern' | 'traditional' | 'romantic' | 'movie-ceremony' | 'default' | 'class-gold' | 'golden-grandeur' | 'blush-ornate' | 'birthday-balloon' | 'botanical-arch' | 'blue-arch';

export interface TemplateProps {
  config: TemplateConfig;
  children: React.ReactNode;
  className?: string;
}
