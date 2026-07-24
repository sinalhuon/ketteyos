import { TemplateConfig, defaultTemplateConfigs, LayoutType } from './index';

/**
 * Get template configuration based on template ID or layout type
 */
export function getTemplateConfig(templateId?: string, layoutType?: LayoutType): TemplateConfig {
    // If templateId is provided, try to map it to a layout type
    if (templateId) {
        const templateMap: Record<string, LayoutType> = {
            'modern': 'modern',
            'traditional': 'traditional',
            'romantic': 'romantic',
            'movie-ceremony': 'movie-ceremony',
            'golden-grandeur': 'golden-grandeur',
            'blush-ornate': 'blush-ornate',
            'birthday-balloon': 'birthday-balloon',
            'frame-floral': 'traditional',
            'frame-elegant': 'traditional',
            'premium-gold': 'default',
            'classic': 'default',
            'default': 'default'
        };

        const mappedLayout = templateMap[templateId];
        if (mappedLayout && defaultTemplateConfigs[mappedLayout]) {
            return defaultTemplateConfigs[mappedLayout];
        }
    }

    // If layoutType is provided, use it
    if (layoutType && defaultTemplateConfigs[layoutType]) {
        return defaultTemplateConfigs[layoutType];
    }

    // Default to default template
    return defaultTemplateConfigs.default;
}

/**
 * Create a custom template configuration by merging base config with customizations
 */
export function createCustomTemplate(
    baseLayoutType: LayoutType,
    customizations: Partial<TemplateConfig>
): TemplateConfig {
    const baseConfig = defaultTemplateConfigs[baseLayoutType];

    return {
        ...baseConfig,
        ...customizations,
        id: customizations.id || `custom-${Date.now()}`,
        name: customizations.name || `Custom ${baseConfig.name}`,
        layoutType: customizations.layoutType || baseLayoutType
    };
}

/**
 * Validate template configuration
 */
export function validateTemplateConfig(config: TemplateConfig): boolean {
    const requiredFields = ['id', 'name', 'layoutType', 'colorScheme', 'typography', 'animations', 'background', 'arrangement'];

    for (const field of requiredFields) {
        if (!(field in config)) {
            console.error(`Missing required field: ${field}`);
            return false;
        }
    }

    // Validate color scheme
    const colorFields = ['primary', 'secondary', 'accent', 'background', 'text', 'textSecondary', 'border'];
    for (const field of colorFields) {
        if (!config.colorScheme[field as keyof typeof config.colorScheme]) {
            console.error(`Missing color scheme field: ${field}`);
            return false;
        }
    }

    // Validate layout type
    const validLayoutTypes: LayoutType[] = ['default', 'modern', 'traditional', 'romantic', 'movie-ceremony', 'class-gold', 'golden-grandeur', 'blush-ornate', 'birthday-balloon'];
    if (!validLayoutTypes.includes(config.layoutType)) {
        console.error(`Invalid layout type: ${config.layoutType}`);
        return false;
    }

    return true;
}

/**
 * Convert template configuration to JSON string for storage
 */
export function serializeTemplateConfig(config: TemplateConfig): string {
    return JSON.stringify(config, null, 2);
}

/**
 * Parse template configuration from JSON string
 */
export function deserializeTemplateConfig(jsonString: string): TemplateConfig | null {
    try {
        const config = JSON.parse(jsonString) as TemplateConfig;
        if (validateTemplateConfig(config)) {
            return config;
        }
        return null;
    } catch (error) {
        console.error('Failed to parse template configuration:', error);
        return null;
    }
}

/**
 * Get available layout types with descriptions
 */
export function getAvailableLayouts() {
    return [
        {
            id: 'default' as LayoutType,
            name: 'Golden Premium',
            description: 'Elegant gold-themed design with video backgrounds',
            category: 'Traditional'
        },
        {
            id: 'modern' as LayoutType,
            name: 'Modern Minimal',
            description: 'Clean, contemporary design with geometric elements',
            category: 'Modern'
        },
        {
            id: 'traditional' as LayoutType,
            name: 'Traditional Heritage',
            description: 'Classic wedding aesthetics with ornate decorations',
            category: 'Traditional'
        },
        {
            id: 'romantic' as LayoutType,
            name: 'Romantic Dreams',
            description: 'Soft pastel colors with floral elements',
            category: 'Romantic'
        },
        {
            id: 'movie-ceremony' as LayoutType,
            name: 'Movie Ceremony',
            description: 'Cinematic opening with dramatic transitions',
            category: 'Cinematic'
        },
        {
            id: 'blush-ornate' as LayoutType,
            name: 'Blush Ornate',
            description: 'Dusty rose ornamental mobile-card layout',
            category: 'Romantic'
        },
        {
            id: 'birthday-balloon' as LayoutType,
            name: 'Birthday Balloon',
            description: 'Blue-and-gold birthday stage layout with photo and balloons',
            category: 'Birthday'
        }
    ];
}
