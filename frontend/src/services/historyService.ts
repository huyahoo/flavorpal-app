// src/services/historyService.ts
import type { ProductInteraction, AiHealthConclusion } from '../types';

/**
 * Simulates fetching a list of all product interactions (scans and reviews) for the user.
 * @returns A Promise that resolves to an array of ProductInteraction objects.
 */
export const fetchProductInteractionsApi = async (): Promise<ProductInteraction[]> => {
  console.log('Mock API Call: Fetching All Product Interactions (History)...');
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

  const mockInteractions: ProductInteraction[] = [
    {
      id: 'hist_item_001',
      name: 'Gourmet Coffee Beans',
      imageUrl: 'https://placehold.co/200x200/6B4F4F/FFFFFF?text=Coffee&font=roboto',
      dateScanned: 'May 10, 2025',
      aiHealthSummary: 'Generally fine, monitor caffeine intake.',
      aiHealthConclusion: 'neutral',
      isReviewed: true,
      userRating: 4.5,
      userNotes: 'Excellent aroma, smooth taste. A bit pricey but worth it for special occasions. Roasted in small batches.',
      dateReviewed: 'May 11, 2025',
      barcode: 'coffee_bean_123',
    },
    {
      id: 'hist_item_002',
      name: 'Artisanal Sourdough Bread',
      imageUrl: 'https://placehold.co/200x200/D1C0A8/FFFFFF?text=Bread&font=roboto',
      dateScanned: 'May 08, 2025',
      aiHealthSummary: 'Contains gluten. If not sensitive, a good choice.',
      aiHealthConclusion: 'good',
      isReviewed: true,
      userRating: 5,
      userNotes: 'Perfect crust and a tangy flavor. Made with organic flour. Best sourdough I have had in ages!',
      dateReviewed: 'May 09, 2025',
    },
    {
      id: 'hist_item_003',
      name: 'Imported Olive Oil',
      imageUrl: 'https://placehold.co/200x200/A3B18A/FFFFFF?text=OliveOil&font=roboto',
      dateScanned: 'May 05, 2025',
      aiHealthSummary: 'Healthy fats, good for cooking and salads.',
      aiHealthConclusion: 'good',
      isReviewed: false, // Not reviewed by the user
    },
    {
      id: 'hist_item_004',
      name: 'Organic Green Tea Bags',
      imageUrl: 'https://placehold.co/200x200/84A98C/FFFFFF?text=Tea&font=roboto',
      dateScanned: 'May 02, 2025',
      aiHealthSummary: 'Rich in antioxidants. Generally very healthy.',
      aiHealthConclusion: 'good',
      isReviewed: true,
      userRating: 3.5,
      userNotes: 'Decent flavor, but not as vibrant as loose leaf. Convenient for a quick cup.',
      dateReviewed: 'May 02, 2025',
    },
    {
      id: 'hist_item_005',
      name: 'Craft IPA Beer',
      imageUrl: 'https://placehold.co/200x200/F4A261/FFFFFF?text=IPA&font=roboto',
      dateScanned: 'Apr 28, 2025',
      aiHealthSummary: 'Contains alcohol. Consume in moderation.',
      aiHealthConclusion: 'caution',
      isReviewed: false,
    },
    {
      id: 'hist_item_006',
      name: 'Aged Cheddar Cheese',
      imageUrl: 'https://placehold.co/200x200/E9C46A/FFFFFF?text=Cheese&font=roboto',
      dateScanned: 'Apr 25, 2025',
      aiHealthSummary: 'High in saturated fat and sodium. Contains dairy.',
      aiHealthConclusion: 'caution',
      isReviewed: true,
      userRating: 4.2,
      userNotes: 'Sharp and crumbly, very flavorful. Paired well with the sourdough bread and some apple slices.',
      dateReviewed: 'Apr 26, 2025',
    },
    {
      id: 'hist_item_007',
      name: 'Spicy Kimchi Ramen',
      dateScanned: 'Apr 20, 2025',
      aiHealthSummary: 'Very high in sodium. Contains wheat and soy. May trigger some sensitivities.',
      aiHealthConclusion: 'avoid', // Assuming user has flags like 'low sodium' or 'soy allergy'
      isReviewed: false,
      barcode: 'ramen_spicy_789',
    },
    {
      id: 'hist_item_008',
      name: 'Plain Greek Yogurt',
      imageUrl: 'https://placehold.co/200x200/E0E7FF/000000?text=Yogurt&font=roboto',
      dateScanned: 'Apr 15, 2025',
      aiHealthSummary: 'Good source of protein and probiotics. Contains dairy.',
      aiHealthConclusion: 'good',
      isReviewed: true,
      userRating: 4.0,
      userNotes: 'Creamy and thick. Great with fruits and honey.',
      dateReviewed: 'Apr 15, 2025',
    }
  ];
  return mockInteractions;
};
