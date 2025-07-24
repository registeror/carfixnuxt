import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, computed, watch, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _imports_0 } from './ProductImage.png.mjs';
import { _ as _imports_1, a as _imports_2 } from './Telegram.png.mjs';
import { useRoute, useRouter } from 'vue-router';
import { a as useRuntimeConfig } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    route.params.id;
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    const productImage = ref(null);
    const productName = ref("");
    const productDescription = ref("");
    const productItems = ref([]);
    route.query.volume;
    const selectedVolume = ref("");
    const loading = ref(true);
    ref(false);
    const selectedPrice = computed(() => {
      const item = productItems.value.find((item2) => item2["product-volume"] === selectedVolume.value);
      return item ? item["product-price"] : 0;
    });
    const formatPrice = (price) => {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price).replace(/\s/g, ".");
    };
    watch(selectedVolume, (newVolume) => {
      var _a;
      if (newVolume && !productItems.value.some((item) => item["product-volume"] === newVolume)) {
        selectedVolume.value = ((_a = productItems.value[0]) == null ? void 0 : _a["product-volume"]) || "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Авто-химия</title><link rel="icon" href="@/image/IcoL.ico" type="image/x-icon"><div class="GoBackBody">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a class="BtnGoBack"${_scopeId}>&lt;- назад</a>`);
          } else {
            return [
              createVNode("a", { class: "BtnGoBack" }, "<- назад")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="loading-overlay"><div class="loading-spinner"></div></div>`);
      } else {
        _push(`<div><div class="PageProductBody"><div class="PageProductContent"><div class="PageImageProduct">`);
        if (productImage.value) {
          _push(`<img loading="lazy" style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "cover" })}"${ssrRenderAttr("src", productImage.value)}>`);
        } else {
          _push(`<img style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "cover" })}" loading="lazy"${ssrRenderAttr("src", _imports_0)}>`);
        }
        _push(`</div><div class="PageProductRightBlock"><div class="PageProductText"><div class="PageProductName">${ssrInterpolate(productName.value)}</div><div class="PagePriceForOne">${ssrInterpolate(formatPrice(selectedPrice.value))} р/1шт</div>`);
        if (productItems.value.length > 1) {
          _push(`<div class="PageVolumeSelect"><label for="volume-select" id="volume-select-text">Размер:</label><select id="volume-select" class="VolumeSelect"><!--[-->`);
          ssrRenderList(productItems.value, (item) => {
            _push(`<option${ssrRenderAttr("value", item["product-volume"])}${ssrIncludeBooleanAttr(Array.isArray(selectedVolume.value) ? ssrLooseContain(selectedVolume.value, item["product-volume"]) : ssrLooseEqual(selectedVolume.value, item["product-volume"])) ? " selected" : ""}>${ssrInterpolate(item["product-volume"])}</option>`);
          });
          _push(`<!--]--></select></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="PageButtonProductAdd"><button class="PageBtnProductAdd">Добавить в корзину</button></div></div><div class="PageProductDescriptionBlock"><div class="PageProductDescription">${ssrInterpolate(productDescription.value)}</div></div></div></div></div></div>`);
      }
      _push(`<div class="PageFooterBody"><div class="PageFooterBodyContent"><div class="PageFooterContacts"><h2 class="FooterTitle">Краснодар:</h2><div class="PageFooterTextContent"><p class="FooterText">+7(928)660-97-79</p><p class="FooterText">+7(928)227-55-15</p><p class="FooterText">+7(967)660-09-51</p><p class="FooterText">+7(967)660-09-47</p><p class="FooterText gmail">info@himautopro.ru</p></div></div><div class="PageFooterSocial"><div class="PageFooterSocialContent"><div class="PageSocial"><img${ssrRenderAttr("src", _imports_1)} style="${ssrRenderStyle({ "width": "45px" })}"><img${ssrRenderAttr("src", _imports_2)} style="${ssrRenderStyle({ "width": "45px" })}"></div></div></div></div></div><!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_.vue2.mjs.map
