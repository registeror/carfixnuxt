import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, watch, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
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
    const errorMessage = ref("");
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    const form = ref({ login: "", password: "" });
    const lastSubmittedForm = ref({ login: "", password: "" });
    const hasFormChanged = ref(false);
    watch(form.value, (newForm) => {
      if (newForm.login !== lastSubmittedForm.value.login || newForm.password !== lastSubmittedForm.value.password) {
        hasFormChanged.value = true;
        errorMessage.value = "";
      }
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="logout-class"${_scopeId}>Перейти на главную страницу</button>`);
          } else {
            return [
              createVNode("button", { class: "logout-class" }, "Перейти на главную страницу")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="login-container"><form class="login-form"><h2 class="form-title">Вход</h2><div class="form-group"><label for="username" class="form-label">Имя пользователя:</label><input type="text" id="username"${ssrRenderAttr("value", form.value.login)} class="form-input" placeholder="Введите имя пользователя" required></div><div class="form-group"><label for="password" class="form-label">Пароль:</label><input type="password" id="password"${ssrRenderAttr("value", form.value.password)} class="form-input" placeholder="Введите пароль" required></div><button type="submit" class="submit-button">Войти</button>`);
      if (errorMessage.value) {
        _push(`<p class="error-message" style="${ssrRenderStyle({ "margin-top": "6px" })}">${ssrInterpolate(errorMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div><!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue.mjs.map
