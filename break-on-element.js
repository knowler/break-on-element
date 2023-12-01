const breakOnElementStyleSheet = new CSSStyleSheet();
await breakOnElementStyleSheet.replace(`:host { display: contents }`);

export class BreakOnElement extends HTMLElement {
	#observer;

	get elementToObserve() {
		return this.querySelector(/*this.hasAttribute("selector") ? this.getAttribute("selector") :*/ "scope > :only-child");
	}

	connectedCallback() {
		if (!this.shadowRoot) {
			this.attachShadow({ mode: "open" });
			this.shadowRoot.adoptedStyleSheets = [breakOnElementStyleSheet];
			this.shadowRoot.innerHTML = "<slot></slot>";
		}

		if (this.elementToObserve) {
			const options = {};

			if (this.hasAttribute("subtree")) {
				options.subtree = true;
			}

			if (this.hasAttribute("attributes")) {
				options.attributes = true;
				options.attributeOldValue = true;
				const attributesValue = this.getAttribute("attributes");
				const isBooleanAttribute = attributesValue === "" || attributesValue === "attributes";
				if (!isBooleanAttribute) {
					options.attributeFilter = attributesValue.split(" ");
				}
			}

			if (this.hasAttribute("children")) {
				options.childList = true;
			}

			// TODO: does characterData allow us to support text changes?
			//if (this.hasAttribute("text")) {
			//	options.characterData = true;
			//	options.characterDataOldValue = true;
			//}

			if (options.attributes || options.childList || options.characterData) {
				this.#observer = new MutationObserver(mutationRecords => {
					debugger;
				});
				this.#observer.observe(this.elementToObserve, options);
			} else {
				console.warn("Not observing: insufficient options supplied");
			}
		}
	}

	disconnectedCallback() {
		this.#observer.disconnect();
	}

	static define(tagName = "break-on") {
		if (!window.customElements.get(tagName)) {
			window[this.name] = this;
			window.customElements.define(tagName, this);
		}
	}
}
