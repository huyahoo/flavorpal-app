// src/services/historyService.ts
import type { ProductInteraction } from '../types'; // Assuming AiHealthConclusion is also in types

/**
 * Simulates fetching a list of all product interactions (scans and reviews) for the user.
 * @returns A Promise that resolves to an array of ProductInteraction objects.
 */
// export const fetchProductInteractionsApi = async (): Promise<ProductInteraction[]> => {
//   console.log('Mock API Call: Fetching All Product Interactions (History)...');
//   await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

//   // Using the same mock data as before for ProductInteraction
//   const mockInteractions: ProductInteraction[] = [
//     {
//       id: 'hist_item_001', name: 'Gourmet Coffee Beans (Reviewed)', imageUrl: 'https://placehold.co/200x200/6B4F4F/FFFFFF?text=Coffee&font=roboto', dateScanned: 'May 10, 2025', aiHealthSummary: 'Generally fine, monitor caffeine intake.', aiHealthConclusion: 'neutral', isReviewed: true, userRating: 4.5, userNotes: 'Excellent aroma, smooth taste. A bit pricey but worth it for special occasions. Roasted in small batches.', dateReviewed: 'May 11, 2025', barcode: 'coffee_bean_123',
//     },
//     {
//       id: 'hist_item_002', name: 'Artisanal Sourdough Bread (Reviewed)', imageUrl: 'https://placehold.co/200x200/D1C0A8/FFFFFF?text=Bread&font=roboto', dateScanned: 'May 08, 2025', aiHealthSummary: 'Contains gluten. If not sensitive, a good choice.', aiHealthConclusion: 'good', isReviewed: true, userRating: 5, userNotes: 'Perfect crust and a tangy flavor. Made with organic flour. Best sourdough I have had in ages!', dateReviewed: 'May 09, 2025',
//     },
//     {
//       id: 'hist_item_003', name: 'Imported Olive Oil (Scanned Only)', imageUrl: 'https://placehold.co/200x200/A3B18A/FFFFFF?text=OliveOil&font=roboto', dateScanned: 'May 05, 2025', aiHealthSummary: 'Healthy fats, good for cooking and salads.', aiHealthConclusion: 'good', isReviewed: false,
//     },
//     {
//       id: 'hist_item_007', name: 'Spicy Kimchi Ramen (Scanned Only)', dateScanned: 'Apr 20, 2025', aiHealthSummary: 'Very high in sodium. Contains wheat and soy.', aiHealthConclusion: 'avoid', isReviewed: false, barcode: 'ramen_spicy_789',
//     },
//     {
//       id: 'hist_item_008', name: 'Plain Greek Yogurt (Reviewed)', imageUrl: 'https://placehold.co/200x200/E0E7FF/000000?text=Yogurt&font=roboto', dateScanned: 'Apr 15, 2025', aiHealthSummary: 'Good source of protein and probiotics. Contains dairy.', aiHealthConclusion: 'good', isReviewed: true, userRating: 4.0, userNotes: 'Creamy and thick. Great with fruits and honey.', dateReviewed: 'Apr 15, 2025',
//     }
//     // Add more diverse items if needed
//   ];
//   return mockInteractions;
// };

/**
 * Simulates fetching user's scanning statistics.
 * @returns A Promise that resolves to an object with scan statistics.
 */
// export const fetchScanStatisticsApi = async (): Promise<{ discoveredThisMonth: number; totalScanned: number }> => {
//     console.log('Mock API Call: Fetching Scan Statistics from History Service...');
//     await new Promise(resolve => setTimeout(resolve, 250)); // Shorter delay
//     // These numbers would ideally be calculated by a backend based on actual scan/review data.
//     // For mock, we can return static or slightly dynamic values.
//     return {
//         discoveredThisMonth: 7, // Example static value
//         totalScanned: 0,       // Example static value
//     };
// };
