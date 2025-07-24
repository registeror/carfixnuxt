import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, computed, watch, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttr, ssrRenderStyle, ssrRenderTeleport, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { _ as _imports_1$1, a as _imports_2$1 } from './Telegram.png.mjs';
import { defineWebSite, defineOrganization, useSchemaOrg } from '@vueuse/schema-org';
import { a as useRuntimeConfig, u as useHead } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'uncsrf';
import 'consola';
import 'node:crypto';
import 'lru-cache';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'xss';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const _imports_0 = "" + __buildAssetsURL("Logo.Dwb7m5aS.jpg");

const _imports_1 = "" + __buildAssetsURL("MainPageImage.DLVszyRh.jpg");

const _imports_2 = "" + __buildAssetsURL("scrol.SYC4ZCKH.png");

const _imports_3 = "" + __buildAssetsURL("CancerImage.SRmK37aL.png");

const useHomeMeta = () => {
  const seoTitle = "Автохимия - интернет-магазин расходных материалов для автомобилей";
  const seoDescription = "Автохимия и расходные материалы для ремонта автомобилей по выгодным ценам. Огромный ассортимент, быстрая доставка по Краснодару и России.";
  const seoKeywords = "автохимия, купить автохимию, автомобильная химия, расходные материалы для авто, автосервис";
  const optimizedImageUrl = "https://ваш-сайт.ru/images/logo-seo.jpg";
  return {
    title: seoTitle,
    meta: [
      // Основные SEO-теги
      { name: "description", content: seoDescription },
      { name: "keywords", content: seoKeywords },
      { name: "robots", content: "index, follow" },
      // OpenGraph (для соцсетей)
      { property: "og:title", content: seoTitle },
      { property: "og:description", content: seoDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ваш-сайт.ru" },
      { property: "og:image", content: optimizedImageUrl },
      { property: "og:image:alt", content: "Логотип магазина Автохимия" },
      { property: "og:site_name", content: "Автохимия" },
      // VK
      { property: "vk:image", content: optimizedImageUrl },
      { property: "vk:title", content: seoTitle },
      // Дополнительные метатеги
      { name: "author", content: "Автохимия" }
    ],
    link: [
      { rel: "canonical", href: "https://ваш-сайт.ru" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  };
};
const useSchemaOrgHome = () => {
  const optimizedImageUrl = "https://ваш-сайт.ru/images/logo-seo.jpg";
  return [
    defineWebSite({
      name: "Автохимия",
      url: "https://ваш-сайт.ru",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://ваш-сайт.ru/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }),
    defineOrganization({
      name: "Автохимия",
      url: "https://ваш-сайт.ru",
      logo: optimizedImageUrl,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+79286609779",
        contactType: "customer service",
        email: "info@himautopro.ru",
        areaServed: "RU"
      }
    })
  ];
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    const itemsPerPage = ref(15);
    const currentPage = ref(0);
    const loading = ref({
      products: true,
      categories: true,
      basket: true
    });
    ref({
      products: false,
      categories: false,
      basket: false
    });
    const isModalOpen = ref(false);
    const isOrderSuccessModalOpen = ref(false);
    const orderNumber = ref(null);
    const isEmailValid = ref(true);
    const emptyFieldsError = ref(null);
    const emailError = ref(null);
    const phoneError = ref(null);
    const activeOrderError = ref(null);
    const promocodeInput = ref("");
    const promocodeValid = ref(null);
    ref("");
    const promocodeDiscount = ref(0);
    const NoValidPromo = ref(null);
    useHead(useHomeMeta());
    useSchemaOrg(useSchemaOrgHome());
    const products = ref([]);
    const categories = ref([]);
    const basket = ref([]);
    ref(null);
    const modalContent = ref(null);
    const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage.value));
    const totalPrice = computed(() => {
      const subtotal = basket.value.reduce((total, item) => {
        return total + item["items-price"] * item["items-quantity"];
      }, 0);
      if (promocodeValid.value && promocodeDiscount.value > 0) {
        return subtotal * (1 - promocodeDiscount.value / 100);
      }
      return subtotal;
    });
    const originalPrice = computed(() => {
      return basket.value.reduce((total, item) => {
        return total + item["items-price"] * item["items-quantity"];
      }, 0);
    });
    const formatPrice = (price) => {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price).replace(/\s/g, ".");
    };
    const getMaxPrice = (product) => {
      if (!product.items || product.items.length === 0) return 0;
      return Math.max(...product.items.map((item) => item["product-price"]));
    };
    const getProductsForPage = (page) => {
      const start = page * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return products.value.slice(start, end);
    };
    const updateSlider = () => {
      const slides = (void 0).querySelector(".slides");
      const pages = (void 0).querySelectorAll(".page");
      if (pages.length > 0) {
        const pageWidth = pages[0].clientWidth;
        slides.style.transform = `translateX(-${currentPage.value * pageWidth}px)`;
      }
      updateNavigationButtons();
      updatePageInput();
    };
    const updateNavigationButtons = () => {
      const prevButton = (void 0).querySelector(".nav-btn.prev");
      const nextButton = (void 0).querySelector(".nav-btn.next");
      if (prevButton && nextButton) {
        prevButton.disabled = currentPage.value === 0;
        prevButton.style.backgroundColor = currentPage.value === 0 ? "gray" : "red";
        nextButton.disabled = currentPage.value === totalPages.value - 1;
        nextButton.style.backgroundColor = currentPage.value === totalPages.value - 1 ? "gray" : "red";
      }
    };
    const updatePageInput = () => {
      const pageInput = (void 0).querySelector(".page-input");
      if (pageInput) {
        pageInput.value = (currentPage.value + 1).toString();
        pageInput.style.backgroundColor = "";
      }
    };
    watch(emptyFieldsError, (newError) => {
      if (modalContent.value) {
        modalContent.value.classList.toggle("with-error", !!newError);
      }
    });
    watch(NoValidPromo, (newError) => {
      if (modalContent.value) {
        modalContent.value.classList.toggle("with-error", !!newError);
      }
    });
    watch(emailError, (newError) => {
      if (modalContent.value) {
        modalContent.value.classList.toggle("with-error", !!newError);
      }
    });
    watch(itemsPerPage, () => {
      updateSlider();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><link rel="icon" href="../image/IcoL.ico" type="image/x-icon"><nav clas="Navbar"><div class="Container"><a href="/" class="Navbar-Logo"><img${ssrRenderAttr("src", _imports_0)} loading="lazy" style="${ssrRenderStyle({ "width": "160px", "height": "100px", "object-fit": "cover" })}"></a><ul class="Navbar-Menu"><li><a href="/">Главная</a></li><li><a href="#section1">Магазин</a></li><li><a href="#section2">О компании</a></li><li><a class="LastA" href="#section3">Контакты</a></li></ul></div></nav>`);
      if (loading.value.products || loading.value.categories) {
        _push(`<div class="loading-overlay"><div class="loading-spinner"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="DivImage"><img${ssrRenderAttr("src", _imports_1)} style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "cover" })}" alt="Автохимия - интернет-магазин автомобильных товаров" itemprop="image"><div class="PageInfoFooter"><img${ssrRenderAttr("src", _imports_2)} style="${ssrRenderStyle({ "width": "50px", "height": "45px" })}"></div></div><div class="MainPageInfoBody"><div class="MainPageInfoScrol"><div class="MainPageInfo"><h1 class="NameStore">Авто-химия</h1><div class="InfoStore"><h2 class="InfoStoreText">Автохимия и расходные материалы для ремонта (очистители, смазки, герметики, ахо, укрывочная продукция, метизы и прочее.) <p class="InfoStoreTextTwo">Выкупим неликвид с вашего склада на выгодных условиях</p></h2></div><div class="DivInfoButton"><button class="InfoButton">Каталог</button></div></div></div></div>`);
      if (basket.value.length > 0) {
        _push(`<div class="CancerBody" style="${ssrRenderStyle({ "transition": "opacity 0.3s ease" })}"><div class="Cancer"><img id="CancerImage" alt=""${ssrRenderAttr("src", _imports_3)} loading="lazy"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (isOrderSuccessModalOpen.value) {
          _push2(`<div id="orderSuccessModal" class="modal-success"><div class="modal-success-content"><div class="modal-success-ModalTitle"><h1 class="modal-success-modaltitle">Ваш заказ успешно создан!</h1></div><div class="modal-success-OrderNumber"><p>Номер вашего заказа: #${ssrInterpolate(orderNumber.value)}</p></div><div class="modal-success-ButtonModal"><button id="modal-success-BtnModal">Закрыть</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (isModalOpen.value) {
          _push2(`<div id="modal" class="modal"><div class="modal-content"><span class="close">×</span><div class="ModalTitle"><h1 class="modaltitle">Ваш заказ:</h1></div><div class="SliderModal"><div class="SlidesModal"><div class="PageModal ActiveModal"><div class="ContainerModal"><!--[-->`);
          ssrRenderList(basket.value, (item, index) => {
            _push2(`<div class="itemModal"><div class="ProductImageModal">`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: `/product/${item["items-product-id"]}?volume=${item["items-product-volume"]}`
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`<img${ssrRenderAttr("src", item["items-product-image"])} style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "cover" })}"${_scopeId}>`);
                } else {
                  return [
                    createVNode("img", {
                      src: item["items-product-image"],
                      style: { "width": "100%", "height": "100%", "object-fit": "cover" }
                    }, null, 8, ["src"])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push2(`</div><div class="InfoProductModal"><h4 class="ProductNameModal">${ssrInterpolate(item["items-product-name"])}</h4>`);
            if (item["items-has-volume"]) {
              _push2(`<div class="ProductSizeModalBox"><h5 class="hsixstyle">Размер: ${ssrInterpolate(item["items-product-volume"])}</h5></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="ProductOneOrderModalBox"><h5 class="hsixstyle">${ssrInterpolate(formatPrice(item["items-price"]))}р/шт</h5></div><div class="QuantityProductModal"><button class="BtnsQuantity">-</button><input type="number"${ssrRenderAttr("id", `quantity${index}`)} class="quantitystye"${ssrRenderAttr("value", item["items-quantity"])} min="1"><button class="BtnsQuantity Plus">+</button></div></div><div class="ProductSumPrice"><h4 id="hfivestyle">${ssrInterpolate(formatPrice(item["items-price"] * item["items-quantity"]))} Руб.</h4></div><div class="DeliteProductModal"><button class="BtnsDeliteProductModal">X</button></div></div>`);
          });
          _push2(`<!--]--></div></div></div></div>`);
          if (loading.value.products) {
            _push2(`<div class="skeleton-container"><!--[-->`);
            ssrRenderList(itemsPerPage.value, (n) => {
              _push2(`<div class="skeleton-item"><div class="skeleton-image"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div><div class="skeleton-button"></div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="ContactsModal"><div class="NameBox"><h2 class="htwostyle">Ваше имя:</h2><input id="NameTextBox" type="text" placeholder=""></div><div class="EmailBox"><h2 class="htwostyle">Ваша почта:</h2><input id="EmailTextBox" type="text" placeholder="" class="${ssrRenderClass({ "invalid-email": !isEmailValid.value })}"></div><div class="NumberBox"><h2 class="htwostyle">Ваш телефон:</h2><input id="NumberTextBox" type="text" placeholder="+7 (918) 000-00-00"></div></div><div class="TotalPrice"><h3 class="SumModal">Сумма:</h3>`);
          if (promocodeValid.value && promocodeDiscount.value > 0) {
            _push2(`<div class="discount-info"><h3 style="${ssrRenderStyle({ "color": "red" })}">${ssrInterpolate(formatPrice(totalPrice.value))} р</h3><h3 style="${ssrRenderStyle({ "text-decoration": "line-through", "color": "#999" })}">${ssrInterpolate(formatPrice(originalPrice.value))} р</h3></div>`);
          } else {
            _push2(`<h3 style="${ssrRenderStyle({ "margin-top": "3px" })}">${ssrInterpolate(formatPrice(totalPrice.value))} р</h3>`);
          }
          _push2(`<input id="PromoTextBox" type="text" class="${ssrRenderClass([{ "invalid-promocode": promocodeValid.value === false }, "input-promocode-style"])}" placeholder="ПРОМОКОД"${ssrRenderAttr("value", promocodeInput.value)}></div><div class="ButtonModal"><button id="BtnModal">Оформить заказ</button>`);
          if (NoValidPromo.value) {
            _push2(`<div class="error-message">${ssrInterpolate(NoValidPromo.value)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (emptyFieldsError.value) {
            _push2(`<div class="error-message">${ssrInterpolate(emptyFieldsError.value)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (emailError.value) {
            _push2(`<div class="error-message-main">${ssrInterpolate(emailError.value)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (phoneError.value) {
            _push2(`<div class="error-message-main">${ssrInterpolate(phoneError.value)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (activeOrderError.value) {
            _push2(`<div class="error-message-main">${ssrInterpolate(activeOrderError.value)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<div class="CategoriesBody"><div class="CategoriesCenter"><div class="Categories" id="section1"><!--[-->`);
      ssrRenderList(categories.value, (category, index) => {
        _push(`<div class="Сategory"><a style="${ssrRenderStyle({ "text-decoration": "none", "color": "black" })}">${ssrInterpolate(category["categories-name"])}</a></div>`);
      });
      _push(`<!--]--></div></div></div><div class="slider"><div class="slides"><!--[-->`);
      ssrRenderList(totalPages.value, (page) => {
        _push(`<div class="${ssrRenderClass([{ active: currentPage.value === page - 1 }, "page"])}"><div class="container"><!--[-->`);
        ssrRenderList(getProductsForPage(page - 1), (item, index) => {
          _push(`<div class="item"><div class="ProductPreview">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/product/${item._id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr("src", item["product-image"])} style="${ssrRenderStyle({ "width": "100%", "height": "100%" })}" loading="lazy"${_scopeId}>`);
              } else {
                return [
                  createVNode("img", {
                    src: item["product-image"],
                    style: { "width": "100%", "height": "100%" },
                    loading: "lazy"
                  }, null, 8, ["src"])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="ProductName">${ssrInterpolate(item["product-name"])}</div><div class="Price">${ssrInterpolate(formatPrice(getMaxPrice(item)))}р<p class="quantity">/1шт</p></div><div class="ProductButton"><button class="ProductBtn">Добавить в корзину</button></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--><div class="slider-gradient"></div></div><div class="navigation"><button class="nav-btn prev">&lt;</button><input class="page-input" type="number"${ssrRenderAttr("value", currentPage.value + 1)} min="1"${ssrRenderAttr("max", totalPages.value)}><button class="nav-btn next">&gt;</button></div></div><div class="AboutUsBody" id="section2"><div class="AboutUsOllContent"><div class="AboutUsContent"><div class="AboutUsOllText"><div class="AboutUsTitle"><h1>О компании</h1></div><div class="AboutUsText"><h2>Мы занимаемся поставками расходных материалов для ремонта в автосалоны, автосервисы, автотранспортные предприятия так, чтобы Вы о них не думали. С радостью возьмем на себя ненужную вам рутину по поиску и доставке материалов для ремонта по самым выгодным ценам. Для нас важно, чтобы с нами вы заработали больше!</h2></div></div><div class="AboutUsLogoContent"><div class="AboutUsLogo"><img class="AboutUsImage"${ssrRenderAttr("src", _imports_0)} loading="lazy"></div></div></div></div></div><div class="YandexMapBody" id="section3"><div class="YandexMapContent"><div style="${ssrRenderStyle({ "position": "relative", "overflow": "hidden" })}"><a href="https://yandex.ru/maps/35/krasnodar/?utm_medium=mapframe&amp;utm_source=maps" style="${ssrRenderStyle({ "color": "#eee", "font-size": "12px", "position": "absolute", "top": "0px" })}">Краснодар</a><a href="https://yandex.ru/maps/35/krasnodar/house/magistralnaya_ulitsa_11k3/Z0AYdgBgQEYOQFpvfXxyc3pqZw==/services/?ll=39.071508%2C45.032397&amp;tab=services&amp;utm_medium=mapframe&amp;utm_source=maps&amp;z=19.4" style="${ssrRenderStyle({ "color": "#eee", "font-size": "12px", "position": "absolute", "top": "14px" })}">Магистральная улица, 11к3 — Яндекс Карты</a><iframe class="YandexMap" src="https://yandex.ru/map-widget/v1/?ll=39.071508%2C45.032397&amp;mode=whatshere&amp;tab=services&amp;whatshere%5Bpoint%5D=39.070931%2C45.032465&amp;whatshere%5Bzoom%5D=17&amp;z=19.4" width="800" height="450" frameborder="1" allowfullscreen="true" style="${ssrRenderStyle({ "position": "relative" })}"></iframe></div></div></div><div class="FooterBody"><div class="FooterBodyContent"><div class="FooterContacts"><h2 class="FooterTitle">Краснодар:</h2><div class="FooterTextContent"><p class="FooterText">+7(928)660-97-79</p><p class="FooterText">+7(928)227-55-15</p><p class="FooterText">+7(967)660-09-51</p><p class="FooterText">+7(967)660-09-47</p><p class="FooterText gmail">info@himautopro.ru</p></div></div><div class="FooterSocial"><div class="FooterSocialContent"><div class="Social"><img${ssrRenderAttr("src", _imports_1$1)} loading="lazy" style="${ssrRenderStyle({ "width": "45px" })}"><img${ssrRenderAttr("src", _imports_2$1)} loading="lazy" style="${ssrRenderStyle({ "width": "45px" })}"></div></div></div></div></div><!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue5.mjs.map
