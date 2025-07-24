import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    route.params.id;
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    ref(null);
    const productName = ref("");
    const productPrice = ref(null);
    const productDescription = ref("");
    ref("500мл");
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
      _push(`</div><div class="PageProductBody"><div class="PageProductContent"><div class="PageImageProduct"><img style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "cover" })}"${ssrRenderAttr("src", _imports_0)}></div><div class="PageProductRightBlock"><div class="PageProductText"><div class="PageProductName">${ssrInterpolate(productName.value)}</div><div class="PagePriceForOne">formatPrice(${ssrInterpolate(productPrice.value)})/1шт</div><div class="PageButtonProductAdd"><button class="PageBtnProductAdd">Добавить в карзину</button></div></div><div class="PageProductDescriptionBlock"><div class="PageProductDescription">${ssrInterpolate(productDescription.value)}</div></div></div></div></div><div class="PageFooterBody"><div class="PageFooterBodyContent"><div class="PageFooterContacts"><h2 class="FooterTitle">Краснодар:</h2><div class="PageFooterTextContent"><p class="FooterText">+7(928)660-97-79</p><p class="FooterText">+7(928)227-55-15</p><p class="FooterText">+7(967)660-09-51</p><p class="FooterText">+7(967)660-09-47</p><p class="FooterText gmail">info@himautopro.ru</p></div></div><div class="PageFooterSocial"><div class="PageFooterSocialContent"><div class="PageSocial"><img${ssrRenderAttr("src", _imports_1)} style="${ssrRenderStyle({ "width": "45px" })}"><img${ssrRenderAttr("src", _imports_2)} style="${ssrRenderStyle({ "width": "45px" })}"></div></div></div></div></div><!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue6.mjs.map
