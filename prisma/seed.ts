import { PrismaClient, Role, Privacy, PartyStatus, Unit } from '@prisma/client';

const prisma = new PrismaClient();

const CLERK_USER_ID = 'user_2tausrmeFQmlryxhyrfwXY9s84z';

async function main() {
  // Create admin user with the provided Clerk ID
  const admin = await prisma.user.create({
    data: {
      clerkId: CLERK_USER_ID,
      name: 'Rowad Speedball Team',
      email: 'rowadsbteam@gmail.com',
      role: Role.ADMIN,
    },
  });

  // Create main categories
  const mainCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Main Dishes | الأطباق الرئيسية',
        description: 'Primary dishes for the meal | الأطباق الرئيسية للوجبة',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Appetizers | المقبلات',
        description: 'Starters and appetizers | المقبلات والمازة',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Desserts | الحلويات',
        description: 'Sweet treats and desserts | الحلويات والتحلية',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beverages | المشروبات',
        description: 'Drinks and refreshments | المشروبات والعصائر',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Serving Items | أدوات التقديم',
        description:
          'Plates, utensils, and serving tools | الأطباق وأدوات المائدة',
      },
    }),
  ]);

  // Create subcategories
  const subCategories = await Promise.all([
    // Main Dishes Subcategories
    prisma.category.create({
      data: {
        name: 'Egyptian Cuisine | المطبخ المصري',
        description: 'Traditional Egyptian dishes | الأكلات المصرية التقليدية',
        parentId: mainCategories[0].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Arabian Cuisine | المطبخ العربي',
        description: 'Middle Eastern dishes | الأكلات العربية',
        parentId: mainCategories[0].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'International Cuisine | المطبخ العالمي',
        description: 'International dishes | الأطباق العالمية',
        parentId: mainCategories[0].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Grilled Dishes | مشويات',
        description: 'Grilled meats and vegetables | اللحوم والخضروات المشوية',
        parentId: mainCategories[0].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Seafood | مأكولات بحرية',
        description: 'Fish and seafood dishes | أطباق السمك والمأكولات البحرية',
        parentId: mainCategories[0].id,
      },
    }),
    // Appetizers Subcategories
    prisma.category.create({
      data: {
        name: 'Cold Appetizers | مقبلات باردة',
        description: 'Cold starters | المقبلات الباردة',
        parentId: mainCategories[1].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hot Appetizers | مقبلات ساخنة',
        description: 'Hot starters | المقبلات الساخنة',
        parentId: mainCategories[1].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Salads | سلطات',
        description: 'Fresh salads and vegetables | السلطات والخضروات الطازجة',
        parentId: mainCategories[1].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dips & Spreads | صلصات ومقبلات',
        description:
          'Dips, sauces and spreads | الصلصات والمقبلات القابلة للدهن',
        parentId: mainCategories[1].id,
      },
    }),
    // Desserts Subcategories
    prisma.category.create({
      data: {
        name: 'Traditional Sweets | حلويات تقليدية',
        description: 'Traditional Arabic sweets | الحلويات العربية التقليدية',
        parentId: mainCategories[2].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Modern Desserts | حلويات عصرية',
        description: 'Modern desserts | الحلويات العصرية',
        parentId: mainCategories[2].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Ramadan Desserts | حلويات رمضان',
        description: 'Special Ramadan sweets | حلويات رمضان الخاصة',
        parentId: mainCategories[2].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Seasonal Sweets | حلويات موسمية',
        description: 'Seasonal and festive desserts | حلويات المواسم والأعياد',
        parentId: mainCategories[2].id,
      },
    }),
    // Beverages Subcategories
    prisma.category.create({
      data: {
        name: 'Ramadan Drinks | مشروبات رمضان',
        description: 'Traditional Ramadan beverages | مشروبات رمضان التقليدية',
        parentId: mainCategories[3].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hot Drinks | مشروبات ساخنة',
        description: 'Hot beverages | المشروبات الساخنة',
        parentId: mainCategories[3].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fresh Juices | عصائر طازجة',
        description: 'Fresh fruit juices | عصائر الفواكه الطازجة',
        parentId: mainCategories[3].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Soft Drinks | مشروبات غازية',
        description: 'Carbonated beverages | المشروبات الغازية',
        parentId: mainCategories[3].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Water | مياه',
        description: 'Still and sparkling water | المياه العادية والغازية',
        parentId: mainCategories[3].id,
      },
    }),
    // Serving Items Subcategories
    prisma.category.create({
      data: {
        name: 'Plates & Bowls | أطباق وأوعية',
        description: 'Serving plates and bowls | أطباق وأوعية التقديم',
        parentId: mainCategories[4].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Utensils | أدوات المائدة',
        description: 'Eating utensils | أدوات تناول الطعام',
        parentId: mainCategories[4].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Serving Tools | أدوات التقديم',
        description: 'Serving utensils and tools | أدوات تقديم الطعام',
        parentId: mainCategories[4].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Disposables | أدوات استخدام مرة واحدة',
        description: 'Disposable items | الأدوات ذات الاستخدام الواحد',
        parentId: mainCategories[4].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Napkins & Papers | مناديل وورقيات',
        description: 'Napkins and paper products | المناديل والمنتجات الورقية',
        parentId: mainCategories[4].id,
      },
    }),
  ]);

  // Create dishes
  const dishes = await Promise.all([
    // Egyptian Main Dishes (subCategories[0])
    prisma.dish.create({
      data: {
        name: 'كشري',
        description:
          'طبق مصري تقليدي من العدس والأرز والمكرونة مع صلصة الطماطم',
        unit: Unit.GRAMS,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/koshari.jpg',
        imageId: 'dishes/koshari',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'ملوخية',
        description: 'ملوخية خضراء مطبوخة مع الثوم والكزبرة',
        unit: Unit.GRAMS,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/molokhia.jpg',
        imageId: 'dishes/molokhia',
      },
    }),
    // More Egyptian Main Dishes (subCategories[0])
    prisma.dish.create({
      data: {
        name: 'طاجن ملوخية باللحم',
        description: 'ملوخية مطبوخة مع قطع اللحم',
        unit: Unit.GRAMS,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/molokhia-meat.jpg',
        imageId: 'dishes/molokhia-meat',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'محشي كرنب',
        description: 'كرنب محشي بالأرز والتوابل',
        unit: Unit.PIECES,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/stuffed-cabbage.jpg',
        imageId: 'dishes/stuffed-cabbage',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'طاجن بطاطس باللحمة',
        description: 'طاجن البطاطس مع اللحم المفروم',
        unit: Unit.GRAMS,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/potato-meat-tagine.jpg',
        imageId: 'dishes/potato-meat-tagine',
      },
    }),
    // Additional Egyptian Main Dishes (subCategories[0])
    prisma.dish.create({
      data: {
        name: 'طاجن بامية',
        description: 'بامية مطهوة باللحم والطماطم',
        unit: Unit.GRAMS,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/okra-tagine.jpg',
        imageId: 'dishes/okra-tagine',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'كوارع',
        description: 'حساء كوارع على الطريقة المصرية',
        unit: Unit.GRAMS,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/cow-feet-soup.jpg',
        imageId: 'dishes/cow-feet-soup',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'مكرونة بشاميل',
        description: 'مكرونة بالبشاميل واللحم المفروم',
        unit: Unit.GRAMS,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/pasta-bechamel.jpg',
        imageId: 'dishes/pasta-bechamel',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'طاجن لسان عصفور',
        description: 'معكرونة صغيرة بالحمام والكبد',
        unit: Unit.GRAMS,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/orzo-tagine.jpg',
        imageId: 'dishes/orzo-tagine',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'محشي ورق عنب',
        description: 'ورق عنب محشي بالأرز واللحم المفروم',
        unit: Unit.PIECES,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/stuffed-grape-leaves.jpg',
        imageId: 'dishes/stuffed-grape-leaves',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'طاجن فول أخضر باللحمة',
        description: 'فول أخضر مطهو باللحم والتوابل',
        unit: Unit.GRAMS,
        categoryId: subCategories[0].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/green-beans-tagine.jpg',
        imageId: 'dishes/green-beans-tagine',
      },
    }),
    // Arabian Main Dishes (subCategories[1])
    prisma.dish.create({
      data: {
        name: 'كبسة لحم',
        description: 'أرز بخاري مع لحم الضأن والبهارات',
        unit: Unit.GRAMS,
        categoryId: subCategories[1].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/kabsa.jpg',
        imageId: 'dishes/kabsa',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'مقلوبة',
        description: 'أرز مع الباذنجان واللحم مقلوب',
        unit: Unit.GRAMS,
        categoryId: subCategories[1].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/maqluba.jpg',
        imageId: 'dishes/maqluba',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'منسف',
        description: 'أرز مع لحم الضأن واللبن المجفف',
        unit: Unit.GRAMS,
        categoryId: subCategories[1].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/mansaf.jpg',
        imageId: 'dishes/mansaf',
      },
    }),
    // More Arabian Main Dishes (subCategories[1])
    prisma.dish.create({
      data: {
        name: 'برياني',
        description: 'أرز بالتوابل مع اللحم والمكسرات',
        unit: Unit.GRAMS,
        categoryId: subCategories[1].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/biryani.jpg',
        imageId: 'dishes/biryani',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'شاورما دجاج',
        description: 'شرائح دجاج متبلة مع الخضار',
        unit: Unit.GRAMS,
        categoryId: subCategories[1].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/chicken-shawarma.jpg',
        imageId: 'dishes/chicken-shawarma',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'شاورما لحم',
        description: 'شرائح لحم متبلة مع الخضار',
        unit: Unit.GRAMS,
        categoryId: subCategories[1].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/meat-shawarma.jpg',
        imageId: 'dishes/meat-shawarma',
      },
    }),
    // International Main Dishes (subCategories[2])
    prisma.dish.create({
      data: {
        name: 'برجر لحم',
        description: 'برجر لحم مع الخضار والصوص',
        unit: Unit.PIECES,
        categoryId: subCategories[2].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/beef-burger.jpg',
        imageId: 'dishes/beef-burger',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'بيتزا',
        description: 'بيتزا بالجبن واللحم والخضار',
        unit: Unit.PIECES,
        categoryId: subCategories[2].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/pizza.jpg',
        imageId: 'dishes/pizza',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'سباجيتي',
        description: 'معكرونة مع صلصة البولونيز',
        unit: Unit.GRAMS,
        categoryId: subCategories[2].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/spaghetti.jpg',
        imageId: 'dishes/spaghetti',
      },
    }),
    // Grilled Dishes (subCategories[3])
    prisma.dish.create({
      data: {
        name: 'مشاوي مشكلة',
        description: 'تشكيلة من اللحوم المشوية',
        unit: Unit.GRAMS,
        categoryId: subCategories[3].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/mixed-grills.jpg',
        imageId: 'dishes/mixed-grills',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'شيش طاووق',
        description: 'قطع دجاج متبلة ومشوية',
        unit: Unit.GRAMS,
        categoryId: subCategories[3].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/shish-tawook.jpg',
        imageId: 'dishes/shish-tawook',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'كباب',
        description: 'لحم مفروم متبل ومشوي',
        unit: Unit.PIECES,
        categoryId: subCategories[3].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/kebab.jpg',
        imageId: 'dishes/kebab',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'كفتة مشوية',
        description: 'لحم مفروم متبل بالبصل والبقدونس',
        unit: Unit.GRAMS,
        categoryId: subCategories[3].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/grilled-kofta.jpg',
        imageId: 'dishes/grilled-kofta',
      },
    }),
    // More Grilled Dishes (subCategories[3])
    prisma.dish.create({
      data: {
        name: 'ريش مشوية',
        description: 'ريش ضأن مشوية متبلة',
        unit: Unit.PIECES,
        categoryId: subCategories[3].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/grilled-ribs.jpg',
        imageId: 'dishes/grilled-ribs',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'فراخ مشوية',
        description: 'دجاج كامل مشوي متبل',
        unit: Unit.PIECES,
        categoryId: subCategories[3].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/grilled-chicken.jpg',
        imageId: 'dishes/grilled-chicken',
      },
    }),
    // Seafood (subCategories[4])
    prisma.dish.create({
      data: {
        name: 'سمك مشوي',
        description: 'سمك طازج مشوي مع التتبيلة',
        unit: Unit.GRAMS,
        categoryId: subCategories[4].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/grilled-fish.jpg',
        imageId: 'dishes/grilled-fish',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'جمبري مشوي',
        description: 'جمبري متبل ومشوي',
        unit: Unit.GRAMS,
        categoryId: subCategories[4].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/grilled-shrimp.jpg',
        imageId: 'dishes/grilled-shrimp',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'صيادية',
        description: 'أرز بالسمك والصنوبر',
        unit: Unit.GRAMS,
        categoryId: subCategories[4].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/sayyadieh.jpg',
        imageId: 'dishes/sayyadieh',
      },
    }),
    // More Seafood (subCategories[4])
    prisma.dish.create({
      data: {
        name: 'كاليماري مقلي',
        description: 'حلقات الكاليماري المقلية',
        unit: Unit.GRAMS,
        categoryId: subCategories[4].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/fried-calamari.jpg',
        imageId: 'dishes/fried-calamari',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'سمك فيليه مقلي',
        description: 'فيليه السمك المقلي',
        unit: Unit.GRAMS,
        categoryId: subCategories[4].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/fried-fish-fillet.jpg',
        imageId: 'dishes/fried-fish-fillet',
      },
    }),
    // Cold Appetizers (subCategories[5])
    prisma.dish.create({
      data: {
        name: 'تبولة',
        description: 'سلطة البقدونس والبرغل',
        unit: Unit.GRAMS,
        categoryId: subCategories[5].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/tabbouleh.jpg',
        imageId: 'dishes/tabbouleh',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'فتوش',
        description: 'سلطة الخضار مع الخبز المحمص',
        unit: Unit.GRAMS,
        categoryId: subCategories[5].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/fattoush.jpg',
        imageId: 'dishes/fattoush',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'ورق عنب',
        description: 'ورق عنب محشي بالأرز والخضار',
        unit: Unit.PIECES,
        categoryId: subCategories[5].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/vine-leaves.jpg',
        imageId: 'dishes/vine-leaves',
      },
    }),
    // More Cold Appetizers (subCategories[5])
    prisma.dish.create({
      data: {
        name: 'لبنة',
        description: 'جبنة اللبنة مع زيت الزيتون',
        unit: Unit.GRAMS,
        categoryId: subCategories[5].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/labneh.jpg',
        imageId: 'dishes/labneh',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'مخللات مشكلة',
        description: 'تشكيلة من المخللات',
        unit: Unit.GRAMS,
        categoryId: subCategories[5].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/mixed-pickles.jpg',
        imageId: 'dishes/mixed-pickles',
      },
    }),
    // Hot Appetizers (subCategories[6])
    prisma.dish.create({
      data: {
        name: 'فطاير سبانخ',
        description: 'عجين محشو بالسبانخ',
        unit: Unit.PIECES,
        categoryId: subCategories[6].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/spinach-fatayer.jpg',
        imageId: 'dishes/spinach-fatayer',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'كبة مقلية',
        description: 'كرات البرغل المحشوة باللحم',
        unit: Unit.PIECES,
        categoryId: subCategories[6].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/fried-kibbeh.jpg',
        imageId: 'dishes/fried-kibbeh',
      },
    }),
    // More Hot Appetizers (subCategories[6])
    prisma.dish.create({
      data: {
        name: 'جوانح دجاج',
        description: 'أجنحة دجاج مقلية حارة',
        unit: Unit.PIECES,
        categoryId: subCategories[6].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/chicken-wings.jpg',
        imageId: 'dishes/chicken-wings',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'بطاطس محمرة',
        description: 'بطاطس مقلية مقرمشة',
        unit: Unit.GRAMS,
        categoryId: subCategories[6].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/french-fries.jpg',
        imageId: 'dishes/french-fries',
      },
    }),
    // Salads (subCategories[7])
    prisma.dish.create({
      data: {
        name: 'سلطة عربية',
        description: 'خضروات طازجة مقطعة',
        unit: Unit.GRAMS,
        categoryId: subCategories[7].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/arabic-salad.jpg',
        imageId: 'dishes/arabic-salad',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'سلطة راهب',
        description: 'سلطة الباذنجان المشوي',
        unit: Unit.GRAMS,
        categoryId: subCategories[7].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/raheb-salad.jpg',
        imageId: 'dishes/raheb-salad',
      },
    }),
    // More Salads (subCategories[7])
    prisma.dish.create({
      data: {
        name: 'سلطة سيزر',
        description: 'خس مع دجاج وجبنة البارميزان',
        unit: Unit.GRAMS,
        categoryId: subCategories[7].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/caesar-salad.jpg',
        imageId: 'dishes/caesar-salad',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'سلطة يونانية',
        description: 'خضار مع جبنة الفيتا والزيتون',
        unit: Unit.GRAMS,
        categoryId: subCategories[7].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/greek-salad.jpg',
        imageId: 'dishes/greek-salad',
      },
    }),
    // Dips & Spreads (subCategories[8])
    prisma.dish.create({
      data: {
        name: 'بابا غنوج',
        description: 'متبل الباذنجان المشوي',
        unit: Unit.GRAMS,
        categoryId: subCategories[8].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/baba-ganoush.jpg',
        imageId: 'dishes/baba-ganoush',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'محمرة',
        description: 'معجون الفلفل الأحمر والجوز',
        unit: Unit.GRAMS,
        categoryId: subCategories[8].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/muhammara.jpg',
        imageId: 'dishes/muhammara',
      },
    }),
    // More Dips & Spreads (subCategories[8])
    prisma.dish.create({
      data: {
        name: 'طحينة',
        description: 'صلصة الطحينة مع الليمون',
        unit: Unit.GRAMS,
        categoryId: subCategories[8].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/tahini.jpg',
        imageId: 'dishes/tahini',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'ثومية',
        description: 'صلصة الثوم البيضاء',
        unit: Unit.GRAMS,
        categoryId: subCategories[8].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/garlic-sauce.jpg',
        imageId: 'dishes/garlic-sauce',
      },
    }),
    // Traditional Sweets (subCategories[9])
    prisma.dish.create({
      data: {
        name: 'كنافة',
        description: 'حلوى شرقية من العجين الرفيع والجبن والقطر',
        unit: Unit.PIECES,
        categoryId: subCategories[9].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/kunafa.jpg',
        imageId: 'dishes/kunafa',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'بسبوسة',
        description: 'حلوى من السميد والقطر',
        unit: Unit.PIECES,
        categoryId: subCategories[9].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/basbousa.jpg',
        imageId: 'dishes/basbousa',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'أم علي',
        description: 'حلوى مصرية من العجين والحليب والمكسرات',
        unit: Unit.GRAMS,
        categoryId: subCategories[9].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/umali.jpg',
        imageId: 'dishes/umali',
      },
    }),
    // More Traditional Sweets (subCategories[9])
    prisma.dish.create({
      data: {
        name: 'بقلاوة',
        description: 'حلوى العجين والمكسرات بالقطر',
        unit: Unit.PIECES,
        categoryId: subCategories[9].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/baklava.jpg',
        imageId: 'dishes/baklava',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'غريبة',
        description: 'بسكويت بالسمن البلدي',
        unit: Unit.PIECES,
        categoryId: subCategories[9].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/ghorayebah.jpg',
        imageId: 'dishes/ghorayebah',
      },
    }),
    // Modern Desserts (subCategories[10])
    prisma.dish.create({
      data: {
        name: 'تشيز كيك',
        description: 'كعكة الجبن مع الفواكه',
        unit: Unit.PIECES,
        categoryId: subCategories[10].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/cheesecake.jpg',
        imageId: 'dishes/cheesecake',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'تيراميسو',
        description: 'حلوى إيطالية من الكريمة والقهوة',
        unit: Unit.PIECES,
        categoryId: subCategories[10].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/tiramisu.jpg',
        imageId: 'dishes/tiramisu',
      },
    }),
    // More Modern Desserts (subCategories[10])
    prisma.dish.create({
      data: {
        name: 'مولتن كيك',
        description: 'كيك الشوكولاتة السائلة',
        unit: Unit.PIECES,
        categoryId: subCategories[10].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/molten-cake.jpg',
        imageId: 'dishes/molten-cake',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'آيس كريم',
        description: 'آيس كريم بنكهات متنوعة',
        unit: Unit.GRAMS,
        categoryId: subCategories[10].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/ice-cream.jpg',
        imageId: 'dishes/ice-cream',
      },
    }),
    // Ramadan Desserts (subCategories[11])
    prisma.dish.create({
      data: {
        name: 'قطايف',
        description: 'عجينة محشوة بالمكسرات أو القشطة',
        unit: Unit.PIECES,
        categoryId: subCategories[11].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/qatayef.jpg',
        imageId: 'dishes/qatayef',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'زلابية',
        description: 'عجينة مقلية مع القطر',
        unit: Unit.PIECES,
        categoryId: subCategories[11].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/zalabia.jpg',
        imageId: 'dishes/zalabia',
      },
    }),
    // More Ramadan Desserts (subCategories[11])
    prisma.dish.create({
      data: {
        name: 'عيش السرايا',
        description: 'حلوى الخبز بالقشطة والقطر',
        unit: Unit.PIECES,
        categoryId: subCategories[11].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/aish-el-saraya.jpg',
        imageId: 'dishes/aish-el-saraya',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'كنافة بالقشطة',
        description: 'كنافة محشوة بالقشطة',
        unit: Unit.PIECES,
        categoryId: subCategories[11].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/dishes/cream-kunafa.jpg',
        imageId: 'dishes/cream-kunafa',
      },
    }),
    // Ramadan Drinks (subCategories[13])
    prisma.dish.create({
      data: {
        name: 'قمر الدين',
        description: 'مشروب المشمش المجفف التقليدي',
        unit: Unit.LITERS,
        categoryId: subCategories[13].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/qamar-el-din.jpg',
        imageId: 'drinks/qamar-el-din',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'تمر هندي',
        description: 'مشروب التمر الهندي المنعش',
        unit: Unit.LITERS,
        categoryId: subCategories[13].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/tamarind.jpg',
        imageId: 'drinks/tamarind',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'عرق سوس',
        description: 'مشروب عرق السوس المنعش',
        unit: Unit.LITERS,
        categoryId: subCategories[13].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/licorice.jpg',
        imageId: 'drinks/licorice',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'الخروب',
        description: 'مشروب الخروب الطبيعي',
        unit: Unit.LITERS,
        categoryId: subCategories[13].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/carob.jpg',
        imageId: 'drinks/carob',
      },
    }),
    // Hot Drinks (subCategories[14])
    prisma.dish.create({
      data: {
        name: 'قهوة عربية',
        description: 'قهوة عربية تقليدية',
        unit: Unit.LITERS,
        categoryId: subCategories[14].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/arabic-coffee.jpg',
        imageId: 'drinks/arabic-coffee',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'شاي',
        description: 'شاي أسود مع النعناع',
        unit: Unit.LITERS,
        categoryId: subCategories[14].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/tea.jpg',
        imageId: 'drinks/tea',
      },
    }),
    // Additional Beverages (subCategories[14] - Hot Drinks)
    prisma.dish.create({
      data: {
        name: 'ينسون',
        description: 'شاي اليانسون العطري',
        unit: Unit.LITERS,
        categoryId: subCategories[14].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/anise-tea.jpg',
        imageId: 'drinks/anise-tea',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'شاي بالنعناع',
        description: 'شاي أسود مع النعناع الطازج',
        unit: Unit.LITERS,
        categoryId: subCategories[14].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/mint-tea.jpg',
        imageId: 'drinks/mint-tea',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'حلبة',
        description: 'مشروب الحلبة الساخن',
        unit: Unit.LITERS,
        categoryId: subCategories[14].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/fenugreek.jpg',
        imageId: 'drinks/fenugreek',
      },
    }),
    // Fresh Juices (subCategories[15])
    prisma.dish.create({
      data: {
        name: 'عصير برتقال',
        description: 'عصير برتقال طازج',
        unit: Unit.LITERS,
        categoryId: subCategories[15].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/orange-juice.jpg',
        imageId: 'drinks/orange-juice',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'عصير مانجو',
        description: 'عصير مانجو طازج',
        unit: Unit.LITERS,
        categoryId: subCategories[15].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/mango-juice.jpg',
        imageId: 'drinks/mango-juice',
      },
    }),
    // Additional Fresh Juices (subCategories[15])
    prisma.dish.create({
      data: {
        name: 'عصير قصب',
        description: 'عصير قصب السكر الطازج',
        unit: Unit.LITERS,
        categoryId: subCategories[15].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/sugarcane-juice.jpg',
        imageId: 'drinks/sugarcane-juice',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'عصير سوبيا',
        description: 'مشروب السوبيا التقليدي',
        unit: Unit.LITERS,
        categoryId: subCategories[15].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/sobia.jpg',
        imageId: 'drinks/sobia',
      },
    }),
    // Soft Drinks (subCategories[16])
    prisma.dish.create({
      data: {
        name: 'كولا',
        description: 'مشروب غازي',
        unit: Unit.LITERS,
        categoryId: subCategories[16].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/cola.jpg',
        imageId: 'drinks/cola',
      },
    }),
    // Water (subCategories[17])
    prisma.dish.create({
      data: {
        name: 'مياه معدنية',
        description: 'مياه معدنية طبيعية',
        unit: Unit.LITERS,
        categoryId: subCategories[17].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/drinks/water.jpg',
        imageId: 'drinks/water',
      },
    }),
    // Plates & Bowls (subCategories[19])
    prisma.dish.create({
      data: {
        name: 'طبق بلاستيك كبير | Large Plastic Plate',
        description: '26 سم - للأطباق الرئيسية',
        unit: Unit.PIECES,
        categoryId: subCategories[19].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/large-plate.jpg',
        imageId: 'serving/large-plate',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'طبق بلاستيك صغير | Small Plastic Plate',
        description: '19 سم - للسلطات والمقبلات',
        unit: Unit.PIECES,
        categoryId: subCategories[19].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/small-plate.jpg',
        imageId: 'serving/small-plate',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'وعاء شوربة | Soup Bowl',
        description: 'وعاء للشوربة والحساء',
        unit: Unit.PIECES,
        categoryId: subCategories[19].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/soup-bowl.jpg',
        imageId: 'serving/soup-bowl',
      },
    }),
    // Utensils (subCategories[20])
    prisma.dish.create({
      data: {
        name: 'ملعقة بلاستيك | Plastic Spoon',
        description: 'ملاعق بلاستيك للاستخدام مرة واحدة',
        unit: Unit.PIECES,
        categoryId: subCategories[20].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/spoon.jpg',
        imageId: 'serving/spoon',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'شوكة بلاستيك | Plastic Fork',
        description: 'شوك بلاستيك للاستخدام مرة واحدة',
        unit: Unit.PIECES,
        categoryId: subCategories[20].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/fork.jpg',
        imageId: 'serving/fork',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'سكين بلاستيك | Plastic Knife',
        description: 'سكاكين بلاستيك للاستخدام مرة واحدة',
        unit: Unit.PIECES,
        categoryId: subCategories[20].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/knife.jpg',
        imageId: 'serving/knife',
      },
    }),
    // Serving Tools (subCategories[21])
    prisma.dish.create({
      data: {
        name: 'ملعقة تقديم كبيرة | Large Serving Spoon',
        description: 'ملعقة تقديم للأرز والأطباق الرئيسية',
        unit: Unit.PIECES,
        categoryId: subCategories[21].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/serving-spoon.jpg',
        imageId: 'serving/serving-spoon',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'مغرفة | Ladle',
        description: 'مغرفة للشوربة والصلصات',
        unit: Unit.PIECES,
        categoryId: subCategories[21].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/ladle.jpg',
        imageId: 'serving/ladle',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'ملقط | Tongs',
        description: 'ملقط للتقديم',
        unit: Unit.PIECES,
        categoryId: subCategories[21].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/tongs.jpg',
        imageId: 'serving/tongs',
      },
    }),
    // Disposables (subCategories[22])
    prisma.dish.create({
      data: {
        name: 'مناديل ورقية | Paper Napkins',
        description: 'مناديل ورقية للمائدة',
        unit: Unit.PIECES,
        categoryId: subCategories[22].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/napkins.jpg',
        imageId: 'serving/napkins',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'أكواب بلاستيك | Plastic Cups',
        description: 'أكواب بلاستيك للمشروبات',
        unit: Unit.PIECES,
        categoryId: subCategories[22].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/plastic-cups.jpg',
        imageId: 'serving/plastic-cups',
      },
    }),
    // More Disposables (subCategories[22])
    prisma.dish.create({
      data: {
        name: 'سفرة بلاستيك | Plastic Table Cover',
        description: 'غطاء طاولة بلاستيك',
        unit: Unit.PIECES,
        categoryId: subCategories[22].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/table-cover.jpg',
        imageId: 'serving/table-cover',
      },
    }),
    prisma.dish.create({
      data: {
        name: 'أكياس قمامة | Trash Bags',
        description: 'أكياس للمخلفات',
        unit: Unit.PIECES,
        categoryId: subCategories[22].id,
        imageUrl:
          'https://res.cloudinary.com/daqvjcynu/image/upload/v1/dishyy/serving/trash-bags.jpg',
        imageId: 'serving/trash-bags',
      },
    }),
  ]);

  // Create 20 historical parties
  await Promise.all([
    // Large public gatherings
    prisma.party.create({
      data: {
        name: 'Eid Grand Feast | عزومة العيد الكبيرة',
        description: 'احتفال العيد مع العائلة والأصدقاء',
        date: new Date('2023-06-15T18:00:00Z'),
        createdById: admin.id,
        maxParticipants: 50,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PUBLIC,
        dishes: {
          create: [
            { dishId: dishes[0].id, amountPerPerson: 300 }, // Main Dish
            { dishId: dishes[1].id, amountPerPerson: 200 }, // Second Main
            { dishId: dishes[13].id, amountPerPerson: 2 }, // Dessert
            { dishId: dishes[35].id, amountPerPerson: 200 }, // Grills
            { dishId: dishes[40].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[45].id, amountPerPerson: 100 }, // Salad
            { dishId: dishes[60].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[61].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Ramadan Community Iftar | إفطار رمضاني',
        description: 'إفطار جماعي في رمضان الماضي',
        date: new Date('2023-04-01T17:30:00Z'),
        createdById: admin.id,
        maxParticipants: 30,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PUBLIC,
        dishes: {
          create: [
            { dishId: dishes[2].id, amountPerPerson: 400 }, // Main Dish
            { dishId: dishes[14].id, amountPerPerson: 0.5 }, // Drinks
            { dishId: dishes[36].id, amountPerPerson: 200 }, // Grills
            { dishId: dishes[41].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[62].id, amountPerPerson: 0.3 }, // More Drinks
            { dishId: dishes[63].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    // Medium private gatherings
    prisma.party.create({
      data: {
        name: 'Weekly Family Dinner | عشاء عائلي',
        description: 'لم شمل العائلة الأسبوعي',
        date: new Date('2023-07-05T19:00:00Z'),
        createdById: admin.id,
        maxParticipants: 15,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[3].id, amountPerPerson: 1 }, // Main Dish
            { dishId: dishes[9].id, amountPerPerson: 100 }, // Appetizer
            { dishId: dishes[64].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[65].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Monthly Friends Gathering | سهرة الأصدقاء',
        description: 'تجمع الأصدقاء الشهري',
        date: new Date('2023-08-08T20:00:00Z'),
        createdById: admin.id,
        maxParticipants: 12,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[4].id, amountPerPerson: 250 }, // Main Dish
            { dishId: dishes[15].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[42].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[83].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    // Small intimate gatherings
    prisma.party.create({
      data: {
        name: 'Afternoon Tea Party | جلسة شاي',
        description: 'جلسة شاي مع الأصدقاء المقربين',
        date: new Date('2023-09-10T16:00:00Z'),
        createdById: admin.id,
        maxParticipants: 6,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[11].id, amountPerPerson: 3 }, // Snacks
            { dishId: dishes[16].id, amountPerPerson: 0.2 }, // Tea
            { dishId: dishes[84].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Graduation Celebration | حفلة التخرج',
        description: 'احتفال بمناسبة التخرج',
        date: new Date('2023-10-20T19:00:00Z'),
        createdById: admin.id,
        maxParticipants: 40,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PUBLIC,
        dishes: {
          create: [
            { dishId: dishes[5].id, amountPerPerson: 350 }, // Main Dish
            { dishId: dishes[37].id, amountPerPerson: 200 }, // Grills
            { dishId: dishes[43].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[73].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[85].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Success Party | عزومة نجاح',
        description: 'احتفال بالنجاح والتفوق',
        date: new Date('2023-11-25T18:30:00Z'),
        createdById: admin.id,
        maxParticipants: 25,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[6].id, amountPerPerson: 300 }, // Main Dish
            { dishId: dishes[17].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[44].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[86].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Neighbors Gathering | لقاء الجيران',
        description: 'تجمع ودي مع الجيران',
        date: new Date('2023-12-12T17:00:00Z'),
        createdById: admin.id,
        maxParticipants: 20,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[0].id, amountPerPerson: 250 }, // Main Dish
            { dishId: dishes[14].id, amountPerPerson: 0.25 }, // Drinks
            { dishId: dishes[45].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[87].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'New Baby Celebration | عزومة مولود جديد',
        description: 'احتفال بقدوم المولود الجديد',
        date: new Date('2024-01-15T15:00:00Z'),
        createdById: admin.id,
        maxParticipants: 35,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PUBLIC,
        dishes: {
          create: [
            { dishId: dishes[2].id, amountPerPerson: 350 }, // Main Dish
            { dishId: dishes[13].id, amountPerPerson: 2 }, // Dessert
            { dishId: dishes[38].id, amountPerPerson: 200 }, // Grills
            { dishId: dishes[46].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[74].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[88].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Sunday Brunch | غداء الأحد',
        description: 'غداء عائلي أسبوعي',
        date: new Date('2024-01-17T13:00:00Z'),
        createdById: admin.id,
        maxParticipants: 10,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[1].id, amountPerPerson: 200 }, // Main Dish
            { dishId: dishes[15].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[47].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[60].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Office Dinner | عشاء العمل',
        description: 'لقاء ودي مع زملاء العمل',
        date: new Date('2024-01-28T19:00:00Z'),
        createdById: admin.id,
        maxParticipants: 15,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[4].id, amountPerPerson: 300 }, // Main Dish
            { dishId: dishes[9].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[65].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[61].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Engagement Party | حفل خطوبة',
        description: 'احتفال بمناسبة الخطوبة',
        date: new Date('2024-02-02T18:00:00Z'),
        createdById: admin.id,
        maxParticipants: 45,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PUBLIC,
        dishes: {
          create: [
            { dishId: dishes[5].id, amountPerPerson: 400 }, // Main Dish
            { dishId: dishes[13].id, amountPerPerson: 2 }, // Dessert
            { dishId: dishes[39].id, amountPerPerson: 200 }, // Grills
            { dishId: dishes[48].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[66].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[62].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Ramadan Suhoor | سحور رمضان',
        description: 'سحور جماعي في رمضان',
        date: new Date('2024-02-05T03:00:00Z'),
        createdById: admin.id,
        maxParticipants: 20,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PUBLIC,
        dishes: {
          create: [
            { dishId: dishes[0].id, amountPerPerson: 250 }, // Main Dish
            { dishId: dishes[16].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[49].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[63].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: "Children's Birthday | عيد ميلاد الأطفال",
        description: 'حفلة عيد ميلاد للأطفال',
        date: new Date('2024-02-18T16:00:00Z'),
        createdById: admin.id,
        maxParticipants: 25,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[7].id, amountPerPerson: 1 }, // Pizza
            { dishId: dishes[13].id, amountPerPerson: 2 }, // Dessert
            { dishId: dishes[50].id, amountPerPerson: 100 }, // Snacks
            { dishId: dishes[67].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[64].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Business Breakfast | فطور عمل',
        description: 'فطور جماعي صباحي',
        date: new Date('2024-02-22T09:00:00Z'),
        createdById: admin.id,
        maxParticipants: 8,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[9].id, amountPerPerson: 150 }, // Hummus
            { dishId: dishes[11].id, amountPerPerson: 4 }, // Pastries
            { dishId: dishes[68].id, amountPerPerson: 0.3 }, // Coffee & Tea
            { dishId: dishes[65].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Anniversary Dinner | حفل ذكرى زواج',
        description: 'احتفال بمناسبة ذكرى الزواج',
        date: new Date('2024-02-27T20:00:00Z'),
        createdById: admin.id,
        maxParticipants: 30,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PUBLIC,
        dishes: {
          create: [
            { dishId: dishes[5].id, amountPerPerson: 350 }, // Main Dish
            { dishId: dishes[12].id, amountPerPerson: 2 }, // Dessert
            { dishId: dishes[51].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[69].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[66].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Alumni Reunion | لقاء خريجي الجامعة',
        description: 'تجمع سنوي لخريجي الجامعة',
        date: new Date('2024-03-03T19:00:00Z'),
        createdById: admin.id,
        maxParticipants: 40,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[0].id, amountPerPerson: 300 }, // Main Dish
            { dishId: dishes[15].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[52].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[67].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Sports Team Dinner | عشاء رياضي',
        description: 'تجمع الفريق الرياضي',
        date: new Date('2024-03-07T20:30:00Z'),
        createdById: admin.id,
        maxParticipants: 20,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[6].id, amountPerPerson: 400 }, // Main Dish
            { dishId: dishes[16].id, amountPerPerson: 0.4 }, // Drinks
            { dishId: dishes[53].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[68].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Office Lunch | غداء المكتب',
        description: 'غداء جماعي في المكتب',
        date: new Date('2024-03-13T12:30:00Z'),
        createdById: admin.id,
        maxParticipants: 15,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[4].id, amountPerPerson: 300 }, // Main Dish
            { dishId: dishes[17].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[54].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[69].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
    prisma.party.create({
      data: {
        name: 'Business Lunch | مقابلة عمل',
        description: 'غداء عمل مع العملاء',
        date: new Date('2024-03-16T13:00:00Z'),
        createdById: admin.id,
        maxParticipants: 8,
        status: PartyStatus.CLOSED,
        privacy: Privacy.PRIVATE,
        dishes: {
          create: [
            { dishId: dishes[5].id, amountPerPerson: 300 }, // Main Dish
            { dishId: dishes[14].id, amountPerPerson: 0.3 }, // Drinks
            { dishId: dishes[55].id, amountPerPerson: 100 }, // Appetizers
            { dishId: dishes[60].id, amountPerPerson: 2 }, // Plates & Utensils
          ],
        },
      },
    }),
  ]);

  // Create the upcoming Ramadan Iftar party
  await prisma.party.create({
    data: {
      name: 'Ramadan Iftar | إفطار رمضان',
      description: 'Traditional Ramadan Iftar gathering | إفطار رمضاني تقليدي',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      createdById: admin.id,
      maxParticipants: 20,
      status: PartyStatus.OPEN,
      privacy: Privacy.PUBLIC,
      dishes: {
        create: [
          {
            dishId: dishes[0].id, // Koshari
            amountPerPerson: 300, // 300g per person
          },
          {
            dishId: dishes[5].id, // Hummus
            amountPerPerson: 100, // 100g per person
          },
          {
            dishId: dishes[8].id, // Kunafa
            amountPerPerson: 1, // 1 piece per person
          },
          {
            dishId: dishes[10].id, // Qamar al-din
            amountPerPerson: 0.3, // 300ml per person
          },
          {
            dishId: dishes[12].id, // Large Plate
            amountPerPerson: 2, // 2 pieces per person
          },
          {
            dishId: dishes[14].id, // Spoon
            amountPerPerson: 2, // 2 pieces per person
          },
        ],
      },
    },
  });

  console.log(
    'Database has been seeded with comprehensive Arabic dishes, serving items, and historical parties'
  );
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
