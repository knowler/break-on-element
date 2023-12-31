export class BreakOnElement extends HTMLElement {
	#observer;

	static {
		this.styleSheet = new CSSStyleSheet();
		this.styleSheet.replaceSync(`:host { display: contents }`);
	}

	get elementToObserve() {
		const elementToObserve = this.querySelector(this.hasAttribute("selector") ? this.getAttribute("selector") : ":scope > :only-child");

		if (this.hasAttribute("text") && !this.hasAttribute("subtree")) {
			let textNode = null;
			for (const node of elementToObserve.childNodes) {
				if (node instanceof Text) {
					textNode = node;
					break;
				}
			}
			return textNode;
		}

		return elementToObserve;
	}

	connectedCallback() {
		if (!this.shadowRoot) {
			this.attachShadow({ mode: "open" });
			this.shadowRoot.adoptedStyleSheets = [this.constructor.styleSheet];
			this.shadowRoot.innerHTML = "<slot></slot>";
		}

		const elementToObserve = this.elementToObserve;

		if (elementToObserve) {
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

			if (this.hasAttribute("text")) {
				options.characterData = true;
				options.characterDataOldValue = true;
			}

			if (options.attributes || options.childList || options.characterData) {
				this.#observer = new MutationObserver(mutationRecords => {
					debugger;
				});
				this.#observer.observe(elementToObserve, options);
			} else {
				console.log("Not observing: insufficient options supplied", this);
			}
		}
	}

	disconnectedCallback() {
		this.#observer?.disconnect();
	}

	static define(tagName = "break-on") {
		if (!window.customElements.get(tagName)) {
			window[this.name] = this;
			window.customElements.define(tagName, this);
		}
	}
}
