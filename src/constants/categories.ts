export const CATEGORIES = [
  { slug: 'electronics', label: 'Electronics', icon: '💻' },
  { slug: 'mobiles', label: 'Mobiles & Tablets', icon: '📱' },
  { slug: 'appliances', label: 'Home Appliances', icon: '🏠' },
  { slug: 'fashion', label: 'Fashion', icon: '👗' },
  { slug: 'groceries', label: 'Groceries', icon: '🛒' },
  { slug: 'health-beauty', label: 'Health & Beauty', icon: '💄' },
  { slug: 'sports', label: 'Sports & Outdoors', icon: '⚽' },
  { slug: 'toys', label: 'Toys & Kids', icon: '🧸' },
  { slug: 'books', label: 'Books', icon: '📚' },
  { slug: 'automotive', label: 'Automotive', icon: '🚗' },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]['slug']