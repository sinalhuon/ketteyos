-- Insert default templates
INSERT INTO `Template` (`id`, `name`, `description`, `previewUrl`, `codeKey`, `category`, `isActive`, `createdAt`)
VALUES
    (UUID(), 'Premium Gold', 'Elegant gold-themed wedding invitation', NULL, 'premium-gold', 'Wedding', 1, NOW()),
    (UUID(), 'Classic White', 'Timeless white wedding invitation', NULL, 'classic-white', 'Wedding', 1, NOW()),
    (UUID(), 'Modern Minimal', 'Clean and modern wedding design', NULL, 'modern-minimal', 'Wedding', 1, NOW()),
    (UUID(), 'Birthday Celebration', 'Fun and colorful birthday invitation', NULL, 'birthday-celebration', 'Birthday', 1, NOW());
