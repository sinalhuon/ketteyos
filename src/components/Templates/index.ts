// Template system exports
export { default as TemplateEngine } from './TemplateEngine';
export { default as TemplateSelector } from './TemplateSelector';

// Layout components
export { default as DefaultLayout } from './layouts/DefaultLayout';
export { default as ModernLayout } from './layouts/ModernLayout';
// export { default as TraditionalLayout } from './layouts/TraditionalLayout';
// export { default as RomanticLayout } from './layouts/RomanticLayout';
// export { default as MovieCeremonyLayout } from './layouts/MovieCeremonyLayout';

// Shared components
export { default as RSVPButton } from './components/shared/RSVPButton';
export { default as MusicControl } from './components/shared/MusicControl';
export { default as CountdownTimer } from './components/shared/CountdownTimer';

// Types and configurations
export type { TemplateConfig, LayoutType, ColorScheme, Typography, AnimationConfig, BackgroundTreatment, ComponentArrangement, TemplateProps, TemplatePageConfig, TemplatePageKey, TemplateBuilderBlock, TemplateBuilderBlockType } from './types';
export { defaultTemplateConfigs } from './configs/defaultConfigs';
export { colorSchemes } from './styles/colorSchemes';
export { typographyOptions } from './styles/typography';
export { animationPresets } from './styles/animations';
