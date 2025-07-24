import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { ref, defineComponent, watch, computed, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { b as useNuxtApp, c as useRequestEvent, a as useRuntimeConfig } from './server.mjs';
import { d as destr, A as klona, B as parse, C as getRequestHeader, D as isEqual, E as setCookie, F as getCookie, G as deleteCookie } from '../_/nitro.mjs';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
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

const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a;
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ?? (opts.filter = (key) => key === name);
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? ((_a = opts.default) == null ? void 0 : _a.call(opts)));
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies || (nuxtApp._cookies = {});
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    const currentPage = ref(0);
    const itemsPerPage = ref(15);
    const products = ref([]);
    const searchQuery = ref("");
    ref([]);
    const tempPromocodes = ref([]);
    ref([]);
    ref(false);
    const showAddModal = ref(false);
    const showDeleteModal = ref(false);
    const newCategoryName = ref("");
    const categories = ref([]);
    const categoryToDelete = ref(null);
    const hoveredCategoryIndex = ref(null);
    const showAddPromocodeModal = ref(false);
    const showAccountsModal = ref(false);
    const accountType = ref(null);
    const accountLogin = ref("");
    const accountNewPassword = ref("");
    const accountConfirmCode = ref("");
    const accountLoginError = ref(false);
    const accountPasswordError = ref(false);
    const accountConfirmError = ref(false);
    ref(false);
    const showErrors = ref(false);
    const accountPasswordConfirmError = ref(false);
    const accountconfirmPassword = ref("");
    const formatPrice = (price) => {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price).replace(/\s/g, ".");
    };
    const fetchAllProducts = async () => {
      try {
        const data = await $fetch(`${apiBaseUrl}/api/products`, {
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": useCookie("csrf").value
          }
        });
        products.value = data;
        updateNavigationButtons();
        updateSlider();
      } catch (error) {
      }
    };
    const searchProducts = async () => {
      try {
        const data = await $fetch(`${apiBaseUrl}/api/products/search/${searchQuery.value}`, {
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": useCookie("csrf").value
          }
        });
        products.value = data;
        currentPage.value = 0;
        updateSlider();
      } catch (error) {
      }
    };
    watch(searchQuery, (newQuery) => {
      if (newQuery.trim() === "") {
        fetchAllProducts();
      } else {
        searchProducts();
      }
    });
    const getMaxPrice = (product) => {
      if (!product.items || product.items.length === 0) return 0;
      return Math.max(...product.items.map((item) => item["product-price"]));
    };
    const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage.value));
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
    const getProductsForPage = (page) => {
      const start = page * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return products.value.slice(start, end);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><button class="logout-class">Выйти</button><div class="CategoriesBody"><div class="vertical-container"><div class="button-container">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/admin/sAdmin/admin-product" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="add-button"${_scopeId}>Добавить товар</button>`);
          } else {
            return [
              createVNode("button", { class: "add-button" }, "Добавить товар")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="add-button">Добавить категорию</button><button class="add-button">Промокоды</button><button class="add-button">Учетные записи</button></div>`);
      if (showAccountsModal.value) {
        _push(`<div class="modal-overlay-accounts"><div class="${ssrRenderClass([{ expanded: accountType.value }, "modal-content-accounts"])}"><h3>Управление учетными записями:</h3>`);
        if (!accountType.value) {
          _push(`<div class="account-type-buttons"><button class="account-type-btn">Главный администратор</button><button class="account-type-btn">Сотрудник</button><button class="account-type-btn cancel">Отмена</button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (accountType.value) {
          _push(`<div class="account-form"><h4>Изменение ${ssrInterpolate(accountType.value === "sAdmin" ? "главного администратора:" : "сотрудника:")}</h4><div class="account-input-group"><label>Логин:</label><input${ssrRenderAttr("value", accountLogin.value)} type="text" placeholder="Введите логин" required class="${ssrRenderClass({ "invalid": accountLoginError.value })}" style="${ssrRenderStyle({ "border-radius": "2px" })}">`);
          if (showErrors.value && accountLoginError.value) {
            _push(`<span class="error-message">Логин должен содержать минимум 6 символов</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="account-input-group"><label>Новый пароль:</label><input${ssrRenderAttr("value", accountNewPassword.value)} type="password" required placeholder="Введите новый пароль" class="${ssrRenderClass({ "invalid": accountPasswordError.value })}" style="${ssrRenderStyle({ "border-radius": "2px" })}">`);
          if (showErrors.value && accountPasswordError.value) {
            _push(`<span class="error-message">Пароль должен содержать минимум 6 символов</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="account-input-group"><label>Подтвердите пароль:</label><input${ssrRenderAttr("value", accountconfirmPassword.value)} type="password" required placeholder="Подтвердите пароль" class="${ssrRenderClass({ "invalid": accountPasswordConfirmError.value })}" style="${ssrRenderStyle({ "border-radius": "2px" })}">`);
          if (showErrors.value && accountPasswordConfirmError.value) {
            _push(`<span class="error-message">Пароли не совпадают</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="account-input-group"><label>Код подтверждения:</label><input${ssrRenderAttr("value", accountConfirmCode.value)} type="text" placeholder="Код" maxlength="6" required class="${ssrRenderClass({ "invalid": accountPasswordError.value })}" style="${ssrRenderStyle({ "border-radius": "2px" })}">`);
          if (showErrors.value && accountConfirmError.value) {
            _push(`<span class="error-message">${ssrInterpolate(accountConfirmCode.value.trim() ? "Код не верный" : "Введите код подтверждения")}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="account-form-buttons"><button class="account-form-btn action"${ssrIncludeBooleanAttr(!accountLogin.value.trim() || accountLoginError.value) ? " disabled" : ""}>Отправить код</button><button class="account-form-btn save"${ssrIncludeBooleanAttr(!accountConfirmCode.value.trim()) ? " disabled" : ""}>Сохранить</button><button class="account-form-btn cancel">Отмена</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="search-container"><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Поиск товаров..." class="search-input search-sAdmin"></div><div class="CategoriesCenter"><div class="Categories" id="section1"><!--[-->`);
      ssrRenderList(categories.value, (category, index) => {
        _push(`<div class="Сategory" style="${ssrRenderStyle({ border: hoveredCategoryIndex.value === index && category["categories-name"] !== "Все" ? "2px solid red" : "none" })}"><a style="${ssrRenderStyle({ "text-decoration": "none", "color": "black" })}">${ssrInterpolate(category["categories-name"])}</a></div>`);
      });
      _push(`<!--]--></div></div></div>`);
      if (showAddPromocodeModal.value) {
        _push(`<div class="modal-overlay-promocode"><div class="modal-content-Promocode"><h3>Управление промокодами:</h3><div class="promocode-list"><!--[-->`);
        ssrRenderList(tempPromocodes.value, (promocode, index) => {
          _push(`<div class="promocode-item"><div class="promocode-fields"><input${ssrRenderAttr("value", promocode["promocode-name"])} type="text" placeholder="Название" class="${ssrRenderClass([{ "invalid": promocode.hasNameError }, "promocode-input"])}"><input${ssrRenderAttr("value", promocode["promocode-active"])} type="number" min="1" placeholder="Кол-во" class="${ssrRenderClass([{ "invalid": promocode.hasActiveError }, "promocode-input"])}"><input${ssrRenderAttr("value", promocode["promocode-discount"])} type="number" min="1" max="100" placeholder="%" class="${ssrRenderClass([{ "invalid": promocode.hasDiscountError }, "promocode-input"])}"></div><button class="delete-promocode-btn"${ssrRenderAttr("title", promocode.isNew ? "Отменить добавление" : "Удалить промокод")}>×</button></div>`);
        });
        _push(`<!--]--></div></div><div class="modal-content-AddPromocode-buttons"><button class="modal-button-addCategory save">Сохранить</button><button class="modal-button-addCategory add">+</button><button class="modal-button-addCategory cancel">Отмена</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showAddModal.value) {
        _push(`<div class="modal-overlay-addCategory"><div class="modal-content-addCategory"><h3>Введите название категории:</h3><input${ssrRenderAttr("value", newCategoryName.value)} type="text" placeholder="Название категории" class="modal-input-addCategory"><div class="modal-buttons-addCategory"><button class="modal-button-addCategory add">Добавить</button><button class="modal-button-addCategory cancel">Отмена</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showDeleteModal.value) {
        _push(`<div class="modal-overlay-deleteCategory"><div class="modal-content-deleteCategory">`);
        if (categoryToDelete.value) {
          _push(`<h3>Вы действительно хотите удалить категорию: &quot;${ssrInterpolate(categoryToDelete.value["categories-name"])}&quot;?</h3>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="modal-buttons-deleteCategory"><button class="modal-button-deleteCategory delete">Удалить</button><button class="modal-button-deleteCategory cancel">Отмена</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="slider"><div class="slides"><!--[-->`);
      ssrRenderList(totalPages.value, (page) => {
        _push(`<div class="${ssrRenderClass([{ active: currentPage.value === page - 1 }, "page"])}"><div class="container"><!--[-->`);
        ssrRenderList(getProductsForPage(page - 1), (item, index) => {
          _push(`<div class="item"><div class="ProductPreview">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/sAdmin/admin-product/${item._id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr("src", item["product-image"])} style="${ssrRenderStyle({ "width": "100%", "height": "100%" })}"${_scopeId}>`);
              } else {
                return [
                  createVNode("img", {
                    src: item["product-image"],
                    style: { "width": "100%", "height": "100%" }
                  }, null, 8, ["src"])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="ProductName">${ssrInterpolate(item["product-name"])}</div><div class="Price">${ssrInterpolate(formatPrice(getMaxPrice(item)))} р<p class="quantity">/1шт</p></div><div class="ProductButton">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/sAdmin/admin-product/${item._id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button class="ProductBtn"${_scopeId}>Изменить товар</button>`);
              } else {
                return [
                  createVNode("button", { class: "ProductBtn" }, "Изменить товар")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div><div class="navigation"><button class="nav-btn prev">&lt;</button><input class="page-input" type="number"${ssrRenderAttr("value", currentPage.value + 1)} min="1"${ssrRenderAttr("max", totalPages.value)}><button class="nav-btn next">&gt;</button></div></div><!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/sAdmin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue3.mjs.map
