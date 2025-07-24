import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, watch, nextTick, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList, ssrLooseEqual } from 'vue/server-renderer';
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
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    const productImage = ref(null);
    const productName = ref("");
    const productPrice = ref(null);
    const productDescription = ref("");
    const categories = ref([]);
    const selectedCategory = ref("");
    const priceInputRef = ref(null);
    const hasVolume = ref(false);
    const volumeItems = ref([{ volume: "", price: "" }]);
    const textareaRef = ref(null);
    const formatPrice = (value, isBackspace = false) => {
      if (!value) return ",00";
      let cleanValue = value.replace(/[^\d,]/g, "");
      const hasComma = cleanValue.includes(",");
      let [rubles = "", kopecks = ""] = cleanValue.split(",");
      kopecks = kopecks.slice(0, 2);
      rubles = rubles.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      if (!hasComma && isBackspace) {
        return rubles;
      }
      if (!hasComma && kopecks) {
        rubles = rubles.slice(0, -kopecks.length) || "0";
      }
      return rubles + (hasComma || kopecks ? "," + kopecks.padEnd(2, "0") : "");
    };
    const initPriceInputMask = () => {
      if (priceInputRef.value) {
        let lastValue = priceInputRef.value.value;
        const handleInput = (event) => {
          const inputEvent = event;
          const input = event.target;
          const cursorPos = input.selectionStart;
          const oldValue = input.value;
          const isBackspace = inputEvent.inputType === "deleteContentBackward";
          if (input.value === "") {
            productPrice.value = null;
            lastValue = "";
            return;
          }
          const commaWasRemoved = lastValue.includes(",") && !input.value.includes(",");
          const formattedValue = formatPrice(input.value, isBackspace && commaWasRemoved);
          input.value = formattedValue;
          const numericValue = parseFloat(formattedValue.replace(/\./g, "").replace(",", "."));
          productPrice.value = isNaN(numericValue) ? null : numericValue;
          if (cursorPos !== null) {
            let newCursorPos = cursorPos;
            if (commaWasRemoved && isBackspace) {
              const commaPos = lastValue.indexOf(",");
              if (cursorPos > commaPos) {
                newCursorPos = cursorPos - 1;
              }
            } else if (formattedValue.includes(",") && !oldValue.includes(",")) {
              newCursorPos = formattedValue.indexOf(",") + 1;
            }
            input.setSelectionRange(newCursorPos, newCursorPos);
          }
          lastValue = formattedValue;
        };
        const handleBlur = (event) => {
          const input = event.target;
          if (!input.value.trim() || input.value === ",00") {
            input.value = "";
            productPrice.value = null;
            lastValue = "";
          } else {
            input.value = formatPrice(input.value);
            lastValue = input.value;
          }
        };
        const handleFocus = (event) => {
          const input = event.target;
          if (input.value === ",00") {
            setTimeout(() => {
              input.setSelectionRange(0, 0);
            }, 10);
          }
        };
        const handleKeyDown = (event) => {
          if (event.key === "Backspace") {
            const input = event.target;
            const cursorPos = input.selectionStart;
            const value = input.value;
            if (cursorPos && value[cursorPos - 1] === ",") {
              event.preventDefault();
              input.setSelectionRange(cursorPos - 1, cursorPos - 1);
            }
          }
        };
        priceInputRef.value.removeEventListener("input", handleInput);
        priceInputRef.value.removeEventListener("blur", handleBlur);
        priceInputRef.value.removeEventListener("focus", handleFocus);
        priceInputRef.value.removeEventListener("keydown", handleKeyDown);
        priceInputRef.value.addEventListener("input", handleInput);
        priceInputRef.value.addEventListener("blur", handleBlur);
        priceInputRef.value.addEventListener("focus", handleFocus);
        priceInputRef.value.addEventListener("keydown", handleKeyDown);
        priceInputRef.value.value = "";
        lastValue = "";
      }
    };
    watch(hasVolume, (newVal) => {
      if (!newVal) {
        volumeItems.value = [{ volume: "", price: "" }];
        nextTick(() => {
          if (priceInputRef.value) {
            priceInputRef.value.value = ",00";
            initPriceInputMask();
          }
        });
      }
    });
    const adjustTextareaHeight = () => {
      if (textareaRef.value) {
        textareaRef.value.style.height = "auto";
        textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
      }
    };
    watch(productDescription, () => {
      adjustTextareaHeight();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Создание товара</title><link rel="icon" href="@/image/IcoL.ico" type="image/x-icon"><div class="GoBackBody">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/admin/sAdmin" }, {
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
      _push(`</div><div class="PageProductBody"><div class="PageProductContent"><div class="PageImageProduct"><input type="file" accept="image/*" style="${ssrRenderStyle({ "display": "none" })}" id="imageUpload"><label for="imageUpload" class="PageBtnProductAdd" style="${ssrRenderStyle({ "cursor": "pointer" })}">${ssrInterpolate(productImage.value ? "Изменить изображение" : "Загрузить изображение")}</label>`);
      if (productImage.value) {
        _push(`<img${ssrRenderAttr("src", productImage.value)} style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "cover" })}">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="PageProductRightBlock"><div class="PageProductText"><div class="product-name-block"><input${ssrRenderAttr("value", productName.value)} placeholder="Введите название товара" class="custom-input name-input"></div><div class="volume-toggle"><label><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(hasVolume.value) ? ssrLooseContain(hasVolume.value, null) : hasVolume.value) ? " checked" : ""}> Товар имеет несколько размеров </label></div><div style="${ssrRenderStyle(!hasVolume.value ? null : { display: "none" })}"><input placeholder="Введите цену товара" class="custom-input price-input-basic"></div>`);
      if (hasVolume.value) {
        _push(`<div class="volume-items-container"><!--[-->`);
        ssrRenderList(volumeItems.value, (item, index) => {
          _push(`<div class="volume-item"><input${ssrRenderAttr("value", item.volume)}${ssrRenderAttr("placeholder", `Рзмер ${index + 1}`)} class="custom-input volume-input"><input${ssrRenderAttr("value", item.price)}${ssrRenderAttr("placeholder", `Стоимость ${index + 1}`)} class="custom-input price-input">`);
          if (hasVolume.value && volumeItems.value.length > 1) {
            _push(`<button class="remove-volume-btn">× </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        if (hasVolume.value) {
          _push(`<button class="add-volume-btn">+ Добавить вариант </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="PageVolumeSelection"><select class="custom-select category-select"><option value="" disabled selected>Выберите категорию товара</option><!--[-->`);
      ssrRenderList(categories.value, (category) => {
        _push(`<option${ssrRenderAttr("value", category._id)}${ssrIncludeBooleanAttr(Array.isArray(selectedCategory.value) ? ssrLooseContain(selectedCategory.value, category._id) : ssrLooseEqual(selectedCategory.value, category._id)) ? " selected" : ""}>${ssrInterpolate(category["categories-name"])}</option>`);
      });
      _push(`<!--]--></select></div><div class="PageButtonProductAdd"><button class="PageAdminBtnProductAdd">Сохранить</button></div></div><div class="PageProductDescriptionBlock"><textarea placeholder="Введите описание товара" class="custom-textarea product-description">${ssrInterpolate(productDescription.value)}</textarea></div></div></div></div><!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/sAdmin/admin-product/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue2.mjs.map
