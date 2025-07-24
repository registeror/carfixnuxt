import { c as defineEventHandler } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'uncsrf';
import 'vue';
import 'consola';
import 'node:crypto';
import 'lru-cache';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'xss';

const urls = defineEventHandler(async () => {
  try {
    const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL;
    console.log("Fetching products from:", `${apiBaseUrl}/api/products`);
    const products = await $fetch(`${apiBaseUrl}/api/products`, {
      headers: {
        "Accept": "application/json",
        "X-XSRF-Token": "bypass-for-sitemap"
        // Обходим CSRF
      },
      // @ts-ignore
      rejectUnauthorized: false
      // Игнорируем SSL ошибки в dev
    });
    console.log("Received products:", products.length);
    return products.map((product) => ({
      loc: `/product/${product._id}`,
      // Используем _id из вашего API
      lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      changefreq: "weekly",
      priority: 0.9,
      // Повышенный приоритет для товаров
      images: [
        {
          loc: product["product-image"],
          title: product["product-name"]
        }
      ]
    }));
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [
      // Fallback для главной страницы
      {
        loc: "/",
        lastmod: (/* @__PURE__ */ new Date()).toISOString(),
        priority: 1
      }
    ];
  }
});

export { urls as default };
//# sourceMappingURL=urls.mjs.map
