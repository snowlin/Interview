import { createLoading, type LoadingInstance } from '../components/Loading';
import type { Directive, App } from 'vue';

type LoadingElement = HTMLElement & {
    instance?: LoadingInstance;
};

const loadingDirective: Directive = {
    mounted(el, binding) {
        const loadingEl = el as LoadingElement;
        const tip = el.getAttribute('loading-tip');
        const background = el.getAttribute('loading-background');
        const size = el.getAttribute('loading-size');
        const fullscreen = !!binding.modifiers.fullscreen;
        const instance = createLoading(
            {
                tip,
                background,
                size: size || 'large',
                loading: !!binding.value,
                absolute: !fullscreen,
            },
            fullscreen ? document.body : el,
        );
        loadingEl.instance = instance;
    },
    updated(el, binding) {
        const loadingEl = el as LoadingElement;
        const instance = loadingEl.instance;
        if (!instance) return;
        instance.setTip(el.getAttribute('loading-tip'));
        if (binding.oldValue !== binding.value) {
            instance.setLoading?.(binding.value && !instance.loading);
        }
    },
    unmounted(el) {
        const loadingEl = el as LoadingElement;
        loadingEl.instance?.close();
    },
};

export function setupLoadingDirective(app: App) {
    app.directive('loading', loadingDirective);
}

export default loadingDirective;
