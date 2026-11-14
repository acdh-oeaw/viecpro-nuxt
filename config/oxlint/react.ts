import { defineConfig } from "oxlint";

/**
 * Settings are _not_ inherited through `extends` - the entry config's `settings` is used verbatim. Exported here so
 * `oxlint.config.ts` can compose them; declaring a `settings` key in this file would be silently dropped.
 */
export const settings = {
	formComponents: ["Form"],
	linkComponents: ["Link", "NavLink"],
};

const config = defineConfig({
	plugins: ["jsx-a11y", "react"],
	rules: {
		/**
		 * ================================================================================================================
		 * Correctness.
		 * ================================================================================================================
		 */

		"jsx-a11y/alt-text": "error",
		"jsx-a11y/anchor-has-content": "error",
		"jsx-a11y/anchor-is-valid": ["error", { components: ["Link"] }],
		"jsx-a11y/aria-activedescendant-has-tabindex": "error",
		"jsx-a11y/aria-props": "error",
		"jsx-a11y/aria-proptypes": "error",
		"jsx-a11y/aria-role": "error",
		"jsx-a11y/aria-unsupported-elements": "error",
		"jsx-a11y/autocomplete-valid": "error",
		"jsx-a11y/click-events-have-key-events": "warn",
		"jsx-a11y/control-has-associated-label": "off",
		"jsx-a11y/heading-has-content": "error",
		"jsx-a11y/html-has-lang": "error",
		"jsx-a11y/iframe-has-title": "error",
		"jsx-a11y/img-redundant-alt": "warn",
		"jsx-a11y/interactive-supports-focus": "error",
		"jsx-a11y/label-has-associated-control": "warn",
		"jsx-a11y/lang": "error",
		"jsx-a11y/media-has-caption": "warn",
		"jsx-a11y/mouse-events-have-key-events": "warn",
		"jsx-a11y/no-access-key": "error",
		"jsx-a11y/no-aria-hidden-on-focusable": "error",
		"jsx-a11y/no-autofocus": ["warn", { ignoreNonDOM: true }],
		"jsx-a11y/no-distracting-elements": "off",
		"jsx-a11y/no-interactive-element-to-noninteractive-role": "off",
		"jsx-a11y/no-noninteractive-element-interactions": "off",
		"jsx-a11y/no-noninteractive-element-to-interactive-role": "off",
		"jsx-a11y/no-noninteractive-tabindex": "error",
		/** @see {@link https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html} */
		"jsx-a11y/no-redundant-roles": ["warn", { ul: ["list"], ol: ["list"] }],
		"jsx-a11y/no-static-element-interactions": "warn",
		/** @see {@link https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/920} */
		"jsx-a11y/prefer-tag-over-role": "off",
		"jsx-a11y/role-has-required-aria-props": "error",
		"jsx-a11y/role-supports-aria-props": "error",
		"jsx-a11y/scope": "error",
		"jsx-a11y/tabindex-no-positive": "error",

		"react/error-boundaries": "error",
		/**
		 * Off in favour of the React Compiler rules: `react/exhaustive-effect-dependencies` covers effects and
		 * `react/memo-dependencies` covers `useMemo()`/`useCallback()`, so this reports the same dependency twice.
		 */
		"react/exhaustive-deps": "off",
		"react/forward-ref-uses-ref": "error",
		"react/globals": "error",
		"react/immutability": "error",
		"react/incompatible-library": "error",
		"react/jsx-key": "error",
		"react/jsx-no-duplicate-props": "error",
		"react/jsx-no-undef": "error",
		"react/jsx-props-no-spread-multi": "error",
		"react/no-children-prop": "error",
		"react/no-danger-with-children": "error",
		"react/no-did-mount-set-state": "error",
		"react/no-did-update-set-state": "off",
		"react/no-direct-mutation-state": "error",
		"react/no-find-dom-node": "error",
		"react/no-is-mounted": "error",
		"react/no-render-return-value": "error",
		"react/no-string-refs": "error",
		"react/no-this-in-sfc": "error",
		"react/no-unsafe": "error",
		"react/no-will-update-set-state": "error",
		"react/preserve-manual-memoization": "error",
		"react/purity": "error",
		"react/refs": "error",
		"react/set-state-in-effect": "error",
		"react/set-state-in-render": "error",
		"react/static-components": "error",
		"react/use-memo": "error",
		"react/void-use-memo": "error",
		"react/void-dom-elements-no-children": "error",

		/**
		 * ================================================================================================================
		 * Suspicious.
		 * ================================================================================================================
		 */

		"react/capitalized-calls": "error",
		"react/exhaustive-effect-dependencies": "error",
		"react/hooks": "error",
		"react/iframe-missing-sandbox": "warn",
		"react/jsx-no-comment-textnodes": "warn",
		"react/jsx-no-script-url": "warn",
		"react/memo-dependencies": "error",
		"react/no-namespace": "error",
		"react/no-unstable-nested-components": ["error", { allowAsProps: true }],
		"react/react-in-jsx-scope": "off",
		"react/style-prop-object": "warn",

		/**
		 * ================================================================================================================
		 * Perf.
		 * ================================================================================================================
		 */

		/** Off because the React Compiler memoizes context values automatically. */
		"react/jsx-no-constructed-context-values": "off",
		"react/no-array-index-key": "warn",
		"react/no-deriving-state-in-effects": "error",
		"react/no-object-type-as-default-prop": "warn",

		/**
		 * ================================================================================================================
		 * Pedantic.
		 * ================================================================================================================
		 */

		"react/checked-requires-onchange-or-readonly": "warn",
		"react/display-name": "off",
		"react/jsx-no-target-blank": "off",
		"react/jsx-no-useless-fragment": "warn",
		"react/no-unescaped-entities": "warn",
		/** Off in favour of `react/hooks`, the React Compiler rule that validates the same thing. */
		"react/rules-of-hooks": "off",

		/**
		 * ================================================================================================================
		 * Restriction.
		 * ================================================================================================================
		 */

		"jsx-a11y/anchor-ambiguous-text": "off",

		"react/button-has-type": "error",
		"react/forbid-component-props": "off",
		"react/forbid-dom-props": "off",
		"react/forbid-elements": "off",
		"react/invariant": "error",
		"react/jsx-filename-extension": "off",
		"react/jsx-no-literals": "off",
		"react/no-clone-element": "warn",
		"react/no-danger": "off",
		"react/no-multi-comp": "off",
		"react/no-react-children": "warn",
		"react/no-unknown-property": "warn",
		"react/only-export-components": "off",
		"react/prefer-function-component": "error",
		"react/rule-suppression": "error",
		"react/syntax": "error",
		"react/todo": "error",
		"react/unsupported-syntax": "error",

		/**
		 * ================================================================================================================
		 * Style.
		 * ================================================================================================================
		 */

		"react/function-component-definition": "error",
		"react/hook-use-state": "warn",
		"react/jsx-boolean-value": ["error", "always"],
		"react/jsx-curly-brace-presence": "off",
		"react/jsx-fragments": ["error", "element"],
		"react/jsx-handler-names": "off",
		"react/jsx-max-depth": "off",
		"react/jsx-pascal-case": "off",
		"react/jsx-props-no-spreading": "off",
		"react/no-redundant-should-component-update": "off",
		"react/no-set-state": "off",
		"react/prefer-es6-class": "off",
		"react/self-closing-comp": "off",
		"react/state-in-constructor": "off",

		/**
		 * ================================================================================================================
		 * Nursery.
		 * ================================================================================================================
		 */

		"react/require-render-return": "off",
	},
});

export default config;
