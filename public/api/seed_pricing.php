<?php
require_once 'cors.php';
require_once 'db.php';

// Simple secret key protection — visit: /api/seed_pricing.php?secret=ketteyos2024
$secret = $_GET['secret'] ?? '';
if ($secret !== 'ketteyos2024') {
    http_response_code(403);
    echo json_encode(['error' => 'Add ?secret=ketteyos2024 to the URL to run this seed.']);
    exit;
}

$newId = fn() => substr(bin2hex(random_bytes(8)), 0, 16);

// Plan limits define what features/quotas each plan allows (enforced by API)
$plans = [
    [
        'id' => $newId(),
        'name' => '🌟 កញ្ចប់ វិចិត្រ',
        'nameEn' => '🌟 Vichet (Standard)',
        'price' => '50',
        'currency' => '$',
        'period' => 'month',
        'duration' => 3,
        'description' => '«សាមញ្ញ តែបង្កប់នូវភាពប្រណិត និងផ្តល់ជូនលើសពីការរំពឹងទុក»',
        'descriptionEn' => '«Simple, elegant, and exceeds expectations»',
        'isPopular' => false,
        'isActive' => true,
        'features' => [
            ['id' => $newId(), 'text' => 'ជ្រើសរើសបាន ១ ភាសា (ខ្មែរ ឬ អង់គ្លេស)', 'textEn' => 'Choose 1 Language (Khmer or English)', 'included' => true],
            ['id' => $newId(), 'text' => 'ការរចនាម៉ូដស្តង់ដារដ៏ទាក់ទាញ', 'textEn' => 'Attractive standard design', 'included' => true],
            ['id' => $newId(), 'text' => 'តន្ត្រីកំដរអារម្មណ៍ (លំនាំដើម)', 'textEn' => 'Default background music', 'included' => true],
            ['id' => $newId(), 'text' => 'វិចិត្រសាលរូបថត Pre-wedding រហូតដល់ ៨ សន្លឹក', 'textEn' => 'Photo gallery (Up to 8 photos)', 'included' => true],
            ['id' => $newId(), 'text' => 'នាឡិការាប់ថយក្រោយដល់ថ្ងៃកម្មវិធី', 'textEn' => 'Countdown timer', 'included' => true],
            ['id' => $newId(), 'text' => 'Link ផ្ទាល់ខ្លួន ងាយស្រួលផ្ញើជូនភ្ញៀវយ៉ាងរហ័ស', 'textEn' => 'Custom Share Link', 'included' => true],
            ['id' => $newId(), 'text' => 'ប៊ូតុងនាំផ្លូវទៅកាន់ទីតាំងកម្មវិធី (Google/Apple Maps)', 'textEn' => 'Google/Apple Maps navigation', 'included' => true],
        ],
        'limits' => [
            'maxEvents' => 1,
            'maxPhotos' => 8,
            'maxLanguages' => 1,
            'smartRsvp' => false,
            'digitalWishes' => false,
            'customMusic' => false,
            'embedVideo' => false,
            'premiumAnimations' => false,
            'addToCalendar' => false,
            'customDesign' => false,
            'customDomain' => false,
            'qrCheckin' => false,
            'vipSupport' => false,
        ],
    ],
    [
        'id' => $newId(),
        'name' => '👑 កញ្ចប់ សិរី',
        'nameEn' => '👑 Serey (Premium)',
        'price' => '150',
        'currency' => '$',
        'period' => 'month',
        'duration' => 6,
        'description' => '«ជម្រើសដ៏ល្អឥតខ្ចោះ និងពេញនិយមបំផុតសម្រាប់ថ្ងៃមង្គល»',
        'descriptionEn' => '«The perfect and most popular choice»',
        'isPopular' => true,
        'isActive' => true,
        'features' => [
            ['id' => $newId(), 'text' => 'ទទួលបានមុខងារពីកញ្ចប់ទី១ទាំងអស់ ព្រមទាំងបន្ថែម', 'textEn' => 'All features from Package 1', 'included' => true],
            ['id' => $newId(), 'text' => 'គាំទ្រ ២ ភាសា (ខ្មែរ និង អង់គ្លេស) ភ្ញៀវអាចចុចប្តូរបាន', 'textEn' => 'Dual Languages (Khmer + English)', 'included' => true],
            ['id' => $newId(), 'text' => 'វិចិត្រសាលរូបថត Pre-wedding រហូតដល់ ១៥ សន្លឹក', 'textEn' => 'Photo gallery (Up to 15 photos)', 'included' => true],
            ['id' => $newId(), 'text' => 'មុខងារបញ្ជាក់ការចូលរួម (Smart RSVP Form) ងាយស្រួលរៀបចំតុ', 'textEn' => 'Smart RSVP Form', 'included' => true],
            ['id' => $newId(), 'text' => 'ប្រអប់ជូនពរឌីជីថល សម្រាប់ភ្ញៀវសរសេរជូនពរ', 'textEn' => 'Digital Wishes Box', 'included' => true],
            ['id' => $newId(), 'text' => 'អាចជ្រើសរើសបទចម្រៀងតាមចំណូលចិត្ត', 'textEn' => 'Custom background music choice', 'included' => true],
            ['id' => $newId(), 'text' => 'ភ្ជាប់វីដេអូ Pre-wedding ទស្សនាផ្ទាល់លើធៀប', 'textEn' => 'Embed Event video', 'included' => true],
        ],
        'limits' => [
            'maxEvents' => 1,
            'maxPhotos' => 15,
            'maxLanguages' => 2,
            'smartRsvp' => true,
            'digitalWishes' => true,
            'customMusic' => true,
            'embedVideo' => true,
            'premiumAnimations' => false,
            'addToCalendar' => false,
            'customDesign' => false,
            'customDomain' => false,
            'qrCheckin' => false,
            'vipSupport' => false,
        ],
    ],
    [
        'id' => $newId(),
        'name' => '💎 កញ្ចប់ ឧត្តម',
        'nameEn' => '💎 Oudom (Deluxe)',
        'price' => '250',
        'currency' => '$',
        'period' => 'month',
        'duration' => 18,
        'description' => '«ស៊ីវិល័យ អន្តរជាតិ និងទាក់ទាញគ្រប់ជ្រុងជ្រោយ»',
        'descriptionEn' => '«Civilized, international, and attractive»',
        'isPopular' => false,
        'isActive' => true,
        'features' => [
            ['id' => $newId(), 'text' => 'ទទួលបានមុខងារពីកញ្ចប់ទី២ទាំងអស់ ព្រមទាំងបន្ថែម', 'textEn' => 'All features from Package 2', 'included' => true],
            ['id' => $newId(), 'text' => 'គាំទ្រដល់ទៅ ៣ ភាសា (ខ្មែរ អង់គ្លេស និង ចិន)', 'textEn' => 'Support for 3 Languages (Khmer, Eng, CH)', 'included' => true],
            ['id' => $newId(), 'text' => 'វិចិត្រសាលរូបថត Pre-wedding មិនកំណត់ចំនួន', 'textEn' => 'Unlimited Photo gallery', 'included' => true],
            ['id' => $newId(), 'text' => 'ការរចនាបែបមានចលនា (Premium Animations)', 'textEn' => 'Premium Animations', 'included' => true],
            ['id' => $newId(), 'text' => 'ប៊ូតុង Add to Calendar លោតចូលកាលវិភាគទូរស័ព្ទភ្ញៀវដោយស្វ័យប្រវត្តិ', 'textEn' => 'Auto Add-to-Calendar Button', 'included' => true],
        ],
        'limits' => [
            'maxEvents' => 3,
            'maxPhotos' => 999,
            'maxLanguages' => 3,
            'smartRsvp' => true,
            'digitalWishes' => true,
            'customMusic' => true,
            'embedVideo' => true,
            'premiumAnimations' => true,
            'addToCalendar' => true,
            'customDesign' => false,
            'customDomain' => false,
            'qrCheckin' => false,
            'vipSupport' => false,
        ],
    ],
    [
        'id' => $newId(),
        'name' => '🚀 កញ្ចប់ អមតៈ (Amata VIP Custom)',
        'nameEn' => '🚀 Amata VIP',
        'price' => '350',
        'currency' => '$',
        'period' => 'one-time',
        'duration' => 1,
        'description' => '«រចនាឡើងផ្តាច់មុខ សម្រាប់តែលោកអ្នកម្នាក់គត់»',
        'descriptionEn' => '«Exclusively custom designed just for you»',
        'isPopular' => false,
        'isActive' => true,
        'features' => [
            ['id' => $newId(), 'text' => 'ទទួលបានមុខងារពីកញ្ចប់ទី៣ទាំងអស់ ព្រមទាំងបន្ថែមមុខងារផ្តាច់មុខ', 'textEn' => 'All features from Package 3', 'included' => true],
            ['id' => $newId(), 'text' => 'ការរចនាម៉ូដថ្មីស្រឡាង (100% Custom Design) តាម Theme កម្មវិធីផ្ទាល់ មិនជាន់គេ', 'textEn' => '100% Custom Theme Design', 'included' => true],
            ['id' => $newId(), 'text' => 'ប្រើប្រាស់ឈ្មោះ Domain ផ្ទាល់ខ្លួន (ឧ. www.synounandsreyoun.com)', 'textEn' => 'Custom Domain (e.g., yourname.com)', 'included' => true],
            ['id' => $newId(), 'text' => 'ប្រព័ន្ធគ្រប់គ្រងភ្ញៀវ និងស្កេន QR Code (E-Ticket Check-in) នៅច្រកចូល', 'textEn' => 'QR Code E-Ticket Check-in System', 'included' => true],
            ['id' => $newId(), 'text' => 'ក្រុមការងារបច្ចេកទេសរង់ចាំជួយ Support VIP ២៤ម៉ោង រហូតដល់ចប់កម្មវិធី', 'textEn' => '24/7 VIP Support during event', 'included' => true],
        ],
        'limits' => [
            'maxEvents' => -1,
            'maxPhotos' => -1,
            'maxLanguages' => 3,
            'smartRsvp' => true,
            'digitalWishes' => true,
            'customMusic' => true,
            'embedVideo' => true,
            'premiumAnimations' => true,
            'addToCalendar' => true,
            'customDesign' => true,
            'customDomain' => true,
            'qrCheckin' => true,
            'vipSupport' => true,
        ],
    ],
];

$payload = ['plans' => $plans, 'showPricing' => true];
$plansJson = json_encode($payload, JSON_UNESCAPED_UNICODE);

try {
    try {
        $pdo->exec("ALTER TABLE AppSettings ADD COLUMN IF NOT EXISTS pricingPlans LONGTEXT NULL");
    } catch (Exception $e) {
    }

    $stmt = $pdo->query("SELECT id FROM AppSettings LIMIT 1");
    $existing = $stmt->fetch();

    if ($existing) {
        $update = $pdo->prepare("UPDATE AppSettings SET pricingPlans = :plans WHERE id = :id");
        $update->execute(['plans' => $plansJson, 'id' => $existing['id']]);
    } else {
        $id = bin2hex(random_bytes(8));
        $insert = $pdo->prepare("INSERT INTO AppSettings (id, pricingPlans) VALUES (:id, :plans)");
        $insert->execute(['id' => $id, 'plans' => $plansJson]);
    }

    echo json_encode([
        'success' => true,
        'message' => '✅ 4 bilingual pricing plans seeded successfully!',
        'plans' => count($plans),
        'hint' => 'Switch language on landing page to see KH/EN translations.'
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>