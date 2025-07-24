// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-security', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  sitemap:{
    sources:['/api/__sitemap__/urls'],
    exclude:['/admin', '/private'],
    cacheMaxAgeSeconds: 1000* 60 *15,
    defaults:{
      changefreq:'daily',
      priority: 0.8,
      lastmod:new Date()
    }
  },
  robots:{
  enabled: true,
  robotsEnabledValue:'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  robotsDisabledValue:'noindex, nofollow',
  allow: ['/'],
  disallow: ['/admin', '/private'],
  sitemap: ['/sitemap.xml'],
  metaTag: true,
  robotsTxt: true,
  cacheControl: 'max-age=14400, must-revalidate',
  },
  css: ['~/assets/main.css'],
  app:{
    head: {
      meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Интернет-магазин автохимии и расходных материалов для ремонта автомобилей' },
      { name: 'keywords', content: 'автохимия, химия, купить автохимию, расходные материалы, автосервис' },
      { name: 'robots', content: 'index, follow' },
      // Open Graph / Facebook
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://localhost:3000' },
      { property: 'og:title', content: 'Автохимия - интернет-магазин' },
      { property: 'og:description', content: 'Автохимия и расходные материалы для ремонта автомобилей по дешевой цене' },
      { property: 'og:image', content: 'https://ваш-сайт.ru/logo.jpg' },
      // VK
      { property: 'vk:card', content: 'summary_large_image' },
      { property: 'vk:url', content: 'https://vk.com/im' },
      { property: 'vk:title', content: 'Автохимия - интернет-магазин' },
      { property: 'vk:description', content: 'Автохимия и расходные материалы для ремонта автомобилей по дешевой цене' },
      { property: 'vk:image', content: 'hhttps://vk.com/im/logo.jpg' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'canonical', href: 'https://localhost:3000' }
    ],
    title: 'Автохимия',
    },
  },
  vite: {
    server: {
      hmr: false // Отключить HMR в продакшене
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },
   security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", "data:", "https://yandex.ru", "https://*.yandex.ru"],
        'connect-src': ["'self'", process.env.NUXT_PUBLIC_API_BASE_URL as string, "https://dluk.one"],
        'frame-src': ["'self'", "https://yandex.ru", "https://*.yandex.ru"],
        'object-src': ["'none'"],
      },
      strictTransportSecurity: {
        maxAge: 15552000,
        includeSubdomains: true,
      },
    },
    hidePoweredBy: true,
    csrf: {
      enabled: true,
        cookie: {
          sameSite: 'strict',
          secure: true,
          httpOnly: false,
      },
      headerName: 'X-XSRF-TOKEN',
    },
  },
})