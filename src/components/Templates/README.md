# Template System

A flexible template system that allows users to choose from different layout styles and customize colors, typography, animations, and component arrangements.

## Architecture

```
src/components/Templates/
├── types.ts                    # TypeScript interfaces
├── configs/
│   └── defaultConfigs.ts       # Default template configurations
├── styles/
│   ├── colorSchemes.ts         # Predefined color schemes
│   ├── typography.ts           # Typography configurations
│   └── animations.ts           # Animation presets
├── layouts/
│   ├── DefaultLayout.tsx       # Current gold design (default)
│   ├── ModernLayout.tsx        # Clean, modern design
│   ├── TraditionalLayout.tsx    # Classic wedding aesthetic
│   ├── RomanticLayout.tsx      # Soft, romantic design
│   └── MovieCeremonyLayout.tsx # Cinematic opening
├── components/
│   ├── shared/                 # Consistent components
│   │   ├── RSVPButton.tsx
│   │   ├── MusicControl.tsx
│   │   └── CountdownTimer.tsx
│   └── customizable/           # Layout-specific components
├── TemplateEngine.tsx          # Main orchestrator
├── TemplateSelector.tsx        # Admin interface component
├── utils.ts                    # Utility functions
└── index.ts                    # Exports
```

## Usage

### Basic Usage

```tsx
import { TemplateEngine, getTemplateConfig } from '@/components/Templates';

// Get template configuration
const templateConfig = getTemplateConfig(templateId);

// Use TemplateEngine
<TemplateEngine 
    templateConfig={templateConfig}
    guestName="John Doe"
    eventTitle="Wedding"
    eventDate={new Date()}
    location="Phnom Penh"
    // ... other props
/>
```

### With Custom Template

```tsx
import { TemplateEngine, createCustomTemplate } from '@/components/Templates';

// Create custom template
const customTemplate = createCustomTemplate('modern', {
    colorScheme: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        // ... other colors
    },
    typography: {
        headingFont: 'Inter, sans-serif',
        // ... other typography settings
    }
});

// Use custom template
<TemplateEngine 
    templateConfig={customTemplate}
    // ... props
/>
```

### Template Selector for Admin Interface

```tsx
import { TemplateSelector } from '@/components/Templates';

function TemplateEditor() {
    const handleTemplateChange = (config) => {
        // Save template configuration
        console.log('New template config:', config);
    };

    return (
        <TemplateSelector 
            onTemplateChange={handleTemplateChange}
            initialTemplate={currentTemplate}
        />
    );
}
```

## Available Layouts

### 1. Default (Classic Gold)
- Elegant gold-themed design
- Video backgrounds
- Traditional Khmer typography
- Gold particle effects

### 2. Modern
- Clean, minimalist design
- Geometric patterns
- Inter font family
- Gradient backgrounds

### 3. Traditional
- Classic wedding aesthetics
- Ornate decorations
- Serif fonts
- Traditional video backgrounds

### 4. Romantic
- Soft pastel colors
- Floral elements
- Cursive fonts
- Dreamy effects

### 5. Movie Ceremony
- Cinematic opening
- Dramatic transitions
- Film-style effects
- Red carpet theme

## Customization Options

### Color Schemes
- Primary, secondary, accent colors
- Background, text, border colors
- Gradient definitions

### Typography
- Font families (Khmer and English)
- Font sizes and weights
- Letter spacing and text shadows

### Animations
- Entrance durations
- Transition styles
- Hover effects
- Background animations

### Component Arrangement
- Photo positioning
- Text alignment
- Button placement
- Section ordering

## Template Configuration

```tsx
interface TemplateConfig {
    id: string;
    name: string;
    description: string;
    layoutType: 'modern' | 'traditional' | 'romantic' | 'movie-ceremony' | 'default';
    colorScheme: ColorScheme;
    typography: Typography;
    animations: AnimationConfig;
    background: BackgroundTreatment;
    arrangement: ComponentArrangement;
    customCSS?: string;
}
```

## Utility Functions

### `getTemplateConfig(templateId?, layoutType?)`
Get template configuration based on template ID or layout type.

### `createCustomTemplate(baseLayoutType, customizations)`
Create a custom template by merging base config with customizations.

### `validateTemplateConfig(config)`
Validate template configuration structure.

### `serializeTemplateConfig(config)` / `deserializeTemplateConfig(jsonString)`
Convert template configuration to/from JSON for storage.

## Integration with Existing System

1. **Backward Compatibility**: Existing `templateId` system continues to work
2. **Database Storage**: Template configurations can be stored as JSON
3. **API Integration**: Template configs can be fetched from backend
4. **Dynamic Loading**: Templates can be loaded dynamically based on user preferences

## Adding New Layouts

1. Create layout component in `layouts/` directory
2. Implement the same props interface as other layouts
3. Add configuration to `defaultConfigs.ts`
4. Update `TemplateEngine.tsx` to include new layout
5. Add to layout options in `TemplateSelector.tsx`

## Shared Components

These components remain consistent across all templates:
- RSVP functionality and UI
- Music control (play/pause)
- Photo gallery with lightbox
- Countdown timer
- Calendar integration
- Map integration

## Styling Guidelines

- Use template configuration for all styling decisions
- Avoid hardcoded colors and fonts
- Implement responsive design for all layouts
- Ensure accessibility with proper contrast ratios
- Test on mobile devices

## Performance Considerations

- Lazy load template components
- Optimize animations for mobile
- Cache template configurations
- Use React.memo for expensive components

## Future Enhancements

- [ ] Add more layout types
- [ ] Implement template preview in admin
- [ ] Add template sharing/exporting
- [ ] Create template marketplace
- [ ] Add advanced customization options
