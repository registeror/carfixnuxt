// composables/seoMeta.js
import { defineOrganization, defineWebSite, defineProduct, defineWebPage } from '@vueuse/schema-org'

export const useProductMeta = (productName, productDescription, selectedPrice, productId, productImage) => {
  if (!productName || !productDescription || !selectedPrice || !productId) {
    console.error('Недостаточно данных для генерации мета-тегов')
    return {}
  }

  const seoFriendlyName = (productName || '')
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]/g, '-')
    .replace(/-+/g, '-');
  
  const optimizedImageUrl = `https://ваш-сайт.ru/images/products/${seoFriendlyName}-${productId}.jpg`;
  const baseKeywords = 'автохимия, авто, химия, купить автохимию';
  const dynamicKeywords = `${productName}, ${baseKeywords}`;

  return {
    title: `${productName} | Магазин автохимии`,
    meta: [
      // OpenGraph для товаров
      { property: 'product:price:amount', content: selectedPrice.toString() },
      { property: 'product:price:currency', content: 'RUB' },
      // Основные SEO-теги
      { name: 'description', content: (productDescription || '').substring(0, 160) },
      { name: 'keywords', content: dynamicKeywords },

      // OpenGraph (обязательные)
      { property: 'og:title', content: `${productName} | Магазин автохимии` },
      { property: 'og:description', content: (productDescription || '').substring(0, 160) },
      { property: 'og:type', content: 'product' },
      { property: 'og:url', content: `https://ваш-сайт.ru/product/${productId}` },
      { property: 'og:image', content: optimizedImageUrl },
      { property: 'og:image:alt', content: `${productName} - фото товара`},
      { property: 'og:site_name', content: 'Автохимия' },
      
      // Специфичные для VK
      { property: 'vk:image', content: optimizedImageUrl },
      { property: 'vk:title', content: `${productName} | Магазин автохимии` },
    ],
    link: [
      { rel: 'canonical', href: `https://ваш-сайт.ru/product/${productId}` }
    ]
  };
};

export const useHomeMeta = () => {
  const seoTitle = 'Автохимия - интернет-магазин расходных материалов для автомобилей';
  const seoDescription = 'Автохимия и расходные материалы для ремонта автомобилей по выгодным ценам. Огромный ассортимент, быстрая доставка по Краснодару и России.';
  const seoKeywords = 'автохимия, купить автохимию, автомобильная химия, расходные материалы для авто, автосервис';
  const optimizedImageUrl = 'https://ваш-сайт.ru/images/logo-seo.jpg';

  return {
    title: seoTitle,
    meta: [
      // Основные SEO-теги
      { name: 'description', content: seoDescription },
      { name: 'keywords', content: seoKeywords },
      { name: 'robots', content: 'index, follow' },

      // OpenGraph (для соцсетей)
      { property: 'og:title', content: seoTitle },
      { property: 'og:description', content: seoDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://ваш-сайт.ru' },
      { property: 'og:image', content: optimizedImageUrl },
      { property: 'og:image:alt', content: 'Логотип магазина Автохимия' },
      { property: 'og:site_name', content: 'Автохимия' },

      // VK
      { property: 'vk:image', content: optimizedImageUrl },
      { property: 'vk:title', content: seoTitle },

      // Дополнительные метатеги
      { name: 'author', content: 'Автохимия' },
    ],
    link: [
      { rel: 'canonical', href: 'https://ваш-сайт.ru' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  };
};

export const useSchemaOrgHome = () => {
  const optimizedImageUrl = 'https://ваш-сайт.ru/images/logo-seo.jpg';

  return [
    defineWebSite({
      name: 'Автохимия',
      url: 'https://ваш-сайт.ru',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://ваш-сайт.ru/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }),
    defineOrganization({
      name: 'Автохимия',
      url: 'https://ваш-сайт.ru',
      logo: optimizedImageUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+79286609779',
        contactType: 'customer service',
        email: 'info@himautopro.ru',
        areaServed: 'RU'
      }
    })
  ];
};
export const useCategoryMeta = (categoryName, productsCount) => {
  if (!categoryName) {
    console.error('Не указано название категории')
    return {}
  }

  const seoTitle = `${categoryName} | Автохимия - интернет-магазин`;
  const seoDescription = `Купить ${categoryName.toLowerCase()} по выгодным ценам. В наличии ${productsCount} товаров. Быстрая доставка по Краснодару и России.`;
  const seoKeywords = `${categoryName}, автохимия ${categoryName.toLowerCase()}, купить ${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} для авто`;
  const optimizedImageUrl = 'https://ваш-сайт.ru/images/category-banner.jpg';

  return {
    title: seoTitle,
    meta: [
      // Основные SEO-теги
      { name: 'description', content: seoDescription },
      { name: 'keywords', content: seoKeywords },
      { name: 'robots', content: 'index, follow' },

      // OpenGraph (для соцсетей)
      { property: 'og:title', content: seoTitle },
      { property: 'og:description', content: seoDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `https://ваш-сайт.ru/category/${categoryName.toLowerCase().replace(/ /g, '-')}` },
      { property: 'og:image', content: optimizedImageUrl },
      { property: 'og:image:alt', content: `Категория: ${categoryName}` },

      // VK
      { property: 'vk:image', content: optimizedImageUrl },
      { property: 'vk:title', content: seoTitle },
    ],
    link: [
      { rel: 'canonical', href: `https://ваш-сайт.ru/category/${categoryName.toLowerCase().replace(/ /g, '-')}` }
    ]
  };
};

export const useSchemaOrgCategory = (categoryName, productsCount) => {
  return [
    defineWebPage({
      name: `${categoryName} | Автохимия`,
      description: `Страница категории ${categoryName} в интернет-магазине Автохимия. Товаров в категории: ${productsCount}`,
    })
  ];
};