import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug logs
console.log('Environment variables:');
console.log(
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:',
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const items = [
  // Egyptian Main Dishes
  {
    name: 'dishes/koshari',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/molokhia',
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/molokhia-meat',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/stuffed-cabbage',
    url: 'https://images.unsplash.com/photo-1605716795075-d035e4f624d6?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/potato-meat-tagine',
    url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/okra-tagine',
    url: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/cow-feet-soup',
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/pasta-bechamel',
    url: 'https://images.unsplash.com/photo-1633436374961-09b92742047b?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/orzo-tagine',
    url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/stuffed-grape-leaves',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/green-beans-tagine',
    url: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=500&h=500&fit=crop',
  },
  // Arabian Main Dishes
  {
    name: 'dishes/kabsa',
    url: 'https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/maqluba',
    url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/mansaf',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/biryani',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/chicken-shawarma',
    url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/meat-shawarma',
    url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&h=500&fit=crop',
  },
  // International Main Dishes
  {
    name: 'dishes/beef-burger',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/pizza',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/spaghetti',
    url: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=500&h=500&fit=crop',
  },
  // Grilled Dishes
  {
    name: 'dishes/mixed-grills',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/shish-tawook',
    url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/kebab',
    url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/grilled-kofta',
    url: 'https://images.unsplash.com/photo-1602253057119-44d745d9b860?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/grilled-ribs',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/grilled-chicken',
    url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&h=500&fit=crop',
  },
  // Seafood
  {
    name: 'dishes/grilled-fish',
    url: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/grilled-shrimp',
    url: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/sayyadieh',
    url: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/fried-calamari',
    url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/fried-fish-fillet',
    url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=500&fit=crop',
  },
  // Cold Appetizers
  {
    name: 'dishes/tabbouleh',
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/fattoush',
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/vine-leaves',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/labneh',
    url: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/mixed-pickles',
    url: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=500&h=500&fit=crop',
  },
  // Hot Appetizers
  {
    name: 'dishes/spinach-fatayer',
    url: 'https://images.unsplash.com/photo-1630173314503-544080d4dee7?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/fried-kibbeh',
    url: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/chicken-wings',
    url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/french-fries',
    url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=500&fit=crop',
  },
  // Salads
  {
    name: 'dishes/arabic-salad',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/raheb-salad',
    url: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/caesar-salad',
    url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/greek-salad',
    url: 'https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=500&h=500&fit=crop',
  },
  // Dips & Spreads
  {
    name: 'dishes/baba-ganoush',
    url: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/muhammara',
    url: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/tahini',
    url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/garlic-sauce',
    url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&h=500&fit=crop',
  },
  // Traditional Sweets
  {
    name: 'dishes/kunafa',
    url: 'https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/basbousa',
    url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/umali',
    url: 'https://images.unsplash.com/photo-1515467837915-15c4777ba46a?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/baklava',
    url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/ghorayebah',
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/rice-pudding',
    url: 'https://images.unsplash.com/photo-1621236378699-8597faf6a176?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/muhalabia',
    url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/balah-el-sham',
    url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&h=500&fit=crop',
  },
  // Modern Desserts
  {
    name: 'dishes/cheesecake',
    url: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/tiramisu',
    url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/molten-cake',
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/ice-cream',
    url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&h=500&fit=crop',
  },
  // Ramadan Desserts
  {
    name: 'dishes/qatayef',
    url: 'https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/zalabia',
    url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/aish-el-saraya',
    url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=500&fit=crop',
  },
  {
    name: 'dishes/cream-kunafa',
    url: 'https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=500&h=500&fit=crop',
  },
  // Drinks
  {
    name: 'drinks/qamar-el-din',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/tamarind',
    url: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/licorice',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/carob',
    url: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/karkadeh',
    url: 'https://images.unsplash.com/photo-1597403491447-3ab08f8e44dc?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/sahlab',
    url: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/doum',
    url: 'https://images.unsplash.com/photo-1560508180-03f285f67ded?w=500&h=500&fit=crop',
  },
  // Hot Drinks
  {
    name: 'drinks/arabic-coffee',
    url: 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/tea',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/anise-tea',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/mint-tea',
    url: 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/fenugreek',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&h=500&fit=crop',
  },
  // Fresh Juices
  {
    name: 'drinks/orange-juice',
    url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/mango-juice',
    url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/sugarcane-juice',
    url: 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=500&h=500&fit=crop',
  },
  {
    name: 'drinks/sobia',
    url: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=500&h=500&fit=crop',
  },
  // Soft Drinks
  {
    name: 'drinks/cola',
    url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&h=500&fit=crop',
  },
  // Water
  {
    name: 'drinks/water',
    url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=500&fit=crop',
  },
  // Serving Items
  {
    name: 'serving/plates',
    url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/utensils',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/cups',
    url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/large-plate',
    url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/small-plate',
    url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/soup-bowl',
    url: 'https://images.unsplash.com/photo-1557687790-902ede7ab58c?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/spoon',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/fork',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/knife',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/serving-spoon',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/ladle',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/tongs',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/napkins',
    url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/plastic-cups',
    url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/table-cover',
    url: 'https://images.unsplash.com/photo-1578500351865-d6c3706f46bc?w=500&h=500&fit=crop',
  },
  {
    name: 'serving/trash-bags',
    url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&h=500&fit=crop',
  },
];

async function uploadImages() {
  for (const item of items) {
    console.log(`Uploading ${item.name}...`);
    try {
      const result = await cloudinary.uploader.upload(item.url, {
        public_id: item.name,
        folder: 'dishyy',
        overwrite: true,
        resource_type: 'image',
        transformation: [
          { width: 500, height: 500, crop: 'fill', gravity: 'auto' },
          { quality: 'auto:low' },
        ],
      });
      console.log(`Successfully uploaded ${item.name}`);
      console.log('Result:', result.secure_url);
    } catch (error) {
      console.error(`Error uploading ${item.name}:`, error);
    }
  }
}

uploadImages()
  .catch(console.error)
  .finally(() => process.exit());
