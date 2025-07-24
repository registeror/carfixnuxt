import { defineComponent, ref, computed, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { a as useRuntimeConfig } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    const notifications = ref([]);
    const orders = ref([]);
    const isModalOpen = ref(false);
    ref(null);
    const searchQuery = ref("");
    const tempOrderStatus = ref("Не готов");
    const isDeleteModalOpen = ref(false);
    const orderToDelete = ref(null);
    ref(false);
    ref("");
    const tempOrder = ref(null);
    const formatPrice = (price) => {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price).replace(/\s/g, ".");
    };
    const filteredOrders = computed(() => {
      let filtered = orders.value;
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        if (query.startsWith("#")) {
          const orderNumberQuery = query.slice(1);
          filtered = filtered.filter(
            (order) => order.orderNumber.toString().includes(orderNumberQuery)
          );
        } else {
          filtered = filtered.filter(
            (order) => order.orderNumber.toString().includes(query) || order["order-gmail"].toLowerCase().includes(query) || order["order-phone"].toLowerCase().includes(query)
          );
        }
      }
      const statusPriority = {
        "Не готов": 3,
        "В обработке": 2,
        "В процессе": 1,
        "Готов": 0
      };
      return filtered.sort((a, b) => {
        const aStatus = a["order-status"];
        const bStatus = b["order-status"];
        if (aStatus in statusPriority && bStatus in statusPriority) {
          return statusPriority[bStatus] - statusPriority[aStatus] || b.orderNumber - a.orderNumber;
        }
        return b.orderNumber - a.orderNumber;
      });
    });
    const totalOrderPrice = computed(() => {
      if (tempOrder.value) {
        return tempOrder.value.items.reduce((total, item) => {
          return total + (item["items-final-price"] || item["items-price"] * item["items-quantity"]);
        }, 0);
      }
      return 0;
    });
    const hasDiscountInOrder = computed(() => {
      var _a;
      return (_a = tempOrder.value) == null ? void 0 : _a.items.some((item) => item["items-promocode"]);
    });
    const originalOrderPrice = computed(() => {
      if (!tempOrder.value) return 0;
      return tempOrder.value.items.reduce((total, item) => {
        return total + (item["items-original-price"] || item["items-price"] * item["items-quantity"]);
      }, 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<!--[--><button class="logout-class">Выйти</button><div class="div-body-yAdmin"><div class="container-order"><div class="search-box"><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Поиск по номеру заказа, почте или телефону" class="search-input"></div><div class="order-list"><!--[-->`);
      ssrRenderList(filteredOrders.value, (order, index) => {
        _push(`<div class="order-item"><div class="order-info"><span class="field-value order-number">#${ssrInterpolate(order.orderNumber)}</span><span class="field-value order-gmail">${ssrInterpolate(order["order-gmail"])}</span><span class="field-value phone">${ssrInterpolate(order["order-phone"])}</span><span class="${ssrRenderClass(["status", {
          "ready": order["order-status"] === "Готов",
          "not-ready": order["order-status"] === "Не готов",
          "processing": order["order-status"] === "В обработке",
          "in-progress": order["order-status"] === "В процессе"
        }])}">${ssrInterpolate(order["order-status"])}</span></div></div>`);
      });
      _push(`<!--]--></div>`);
      if (isDeleteModalOpen.value) {
        _push(`<div class="modal-overlay-delete"><div class="modal-content-delete"><span class="close-yAdmin">×</span><h2>Вы действительно хотите удалить заказ #${ssrInterpolate((_a = orderToDelete.value) == null ? void 0 : _a.orderNumber)}?</h2><div class="modal-actions"><button class="btn-delete">Удалить</button><button class="btn-cancel">Отмена</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="notification-container"><!--[-->`);
      ssrRenderList(notifications.value, (notification) => {
        _push(`<div class="notification">${ssrInterpolate(notification.message)}</div>`);
      });
      _push(`<!--]--></div>`);
      if (isModalOpen.value) {
        _push(`<div class="modal-overlay"><div class="modal-content"><span class="close-yAdmin">×</span><h2 style="${ssrRenderStyle({ "text-align": "left" })}">Информация о заказе:</h2><div class="SliderModal"><div class="SlidesModal"><div class="PageModal ActiveModal"><div class="ContainerModal"><!--[-->`);
        ssrRenderList((_b = tempOrder.value) == null ? void 0 : _b.items, (item, index) => {
          _push(`<div class="itemModal"><div class="ProductImageModal">`);
          _push(ssrRenderComponent(unref(__nuxt_component_0), {
            to: `/product/${item["items-product-id"]}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr("src", item["items-product-image"])} style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "cover" })}"${_scopeId}>`);
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
          _push(`</div><div class="InfoProductModal"><h4 class="ProductNameModal">${ssrInterpolate(item["items-product-name"])}</h4>`);
          if (item["items-has-volume"]) {
            _push(`<div class="ProductSizeModalBox"><h5 class="hsixstyle">Размер: ${ssrInterpolate(item["items-product-volume"])}</h5></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="ProductOneOrderModalBox"><h5 class="hsixstyle">${ssrInterpolate(formatPrice(item["items-price"]))} р./шт</h5></div><div class="QuantityProductModal"><button class="BtnsQuantity">-</button><input type="number"${ssrRenderAttr("id", `quantity${index}`)} class="quantitystye"${ssrRenderAttr("value", item["items-quantity"])} min="1" max="99"><button class="BtnsQuantity Plus">+</button></div></div><div class="ProductSumPrice"><h4 id="hfivestyle">${ssrInterpolate(formatPrice(item["items-price"] * item["items-quantity"]))} /Руб.</h4></div><div class="DeliteProductModal"><button class="BtnsDeliteProductModal">X</button></div></div>`);
        });
        _push(`<!--]--></div></div></div></div>`);
        if (tempOrder.value) {
          _push(`<div class="modal-info"><p class="order-info-text"><strong>Имя:</strong> ${ssrInterpolate(tempOrder.value["order-name"])}</p><p class="order-info-text"><strong>Почта:</strong> ${ssrInterpolate(tempOrder.value["order-gmail"])}</p><p class="order-info-text"><strong>Телефон:</strong> ${ssrInterpolate(tempOrder.value["order-phone"])}</p><p class="order-info-text"><strong style="${ssrRenderStyle({ "margin-top": "2px" })}">Статус:</strong><select style="${ssrRenderStyle({ "height": "28px", "padding": "0px" })}"><option value="Не готов"${ssrIncludeBooleanAttr(Array.isArray(tempOrderStatus.value) ? ssrLooseContain(tempOrderStatus.value, "Не готов") : ssrLooseEqual(tempOrderStatus.value, "Не готов")) ? " selected" : ""}>Не готов</option><option value="В обработке"${ssrIncludeBooleanAttr(Array.isArray(tempOrderStatus.value) ? ssrLooseContain(tempOrderStatus.value, "В обработке") : ssrLooseEqual(tempOrderStatus.value, "В обработке")) ? " selected" : ""}>В обработке</option><option value="В процессе"${ssrIncludeBooleanAttr(Array.isArray(tempOrderStatus.value) ? ssrLooseContain(tempOrderStatus.value, "В процессе") : ssrLooseEqual(tempOrderStatus.value, "В процессе")) ? " selected" : ""}>В процессе</option><option value="Готов"${ssrIncludeBooleanAttr(Array.isArray(tempOrderStatus.value) ? ssrLooseContain(tempOrderStatus.value, "Готов") : ssrLooseEqual(tempOrderStatus.value, "Готов")) ? " selected" : ""}>Готов</option></select></p><p class="order-info-text"><strong>Сумма:</strong> ${ssrInterpolate(formatPrice(totalOrderPrice.value))}р `);
          if (hasDiscountInOrder.value) {
            _push(`<span style="${ssrRenderStyle({ "text-decoration": "line-through", "color": "#999" })}">${ssrInterpolate(formatPrice(originalOrderPrice.value))}р </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="modal-actions"><button class="btn-save">Сохранить изменения</button><button class="btn-delete">Удалить заказ</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/yAdmin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue4.mjs.map
