interface Product {
  _id: string;
  "product-name": string;
  "product-description": string;
  "product-image": string;
  items: Array<{ 'product-volume': string, 'product-price': number }>;
  updatedAt?: string | Date;
}

export default defineEventHandler(async (): Promise<{
  loc: string
  lastmod: string
  changefreq?: string
  priority?: number
  images?: Array<{ loc: string, title?: string }>
}[]> => {
  
  try {
    const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL;
    console.log('Fetching products from:', `${apiBaseUrl}/api/products`)

    const products = await $fetch<Product[]>(`${apiBaseUrl}/api/products`, {
      headers: {
        'Accept': 'application/json',
        'X-XSRF-Token': 'bypass-for-sitemap' // Обходим CSRF
      },
      // @ts-ignore
      rejectUnauthorized: false // Игнорируем SSL ошибки в dev
    });
    
console.log('Received products:', products.length)
    return products.map(product => ({
      loc: `/product/${product._id}`, // Используем _id из вашего API
      lastmod: product.updatedAt 
        ? new Date(product.updatedAt).toISOString() 
        : new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9, // Повышенный приоритет для товаров
      images: [
        {
          loc: product["product-image"],
          title: product["product-name"]
        }
      ]
    }));
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return [
      // Fallback для главной страницы
      {
        loc: '/',
        lastmod: new Date().toISOString(),
        priority: 1.0
      }
    ];
  }
});