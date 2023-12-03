# Break On Element

A custom element that is a declarative `MutationObserver` for debugging.
Instead of opening your developer tools to set these breakpoints wrap
the element in the `<break-on>` custom element. [See the demo](https://knowler.github.io/break-on-element/demo).

## Defining

```javascript
import { BreakOnElement } from "https://esm.sh/gh/knowler/break-on-element/break-on-element.js?raw";

BreakOnElement.define();
```

## Usage

```html
<break-on attributes>
	<p>Will break on all attribute modifications for this element.</p>
</break-on>

<break-on attributes="class">
	<p>Will break on class name modifications for this element.</p>
</break-on>

<break-on attributes="class id">
	<p>Will break on class name and ID modifications for this element.</p>
</break-on>

<break-on attributes="class id" subtree>
	<p>Will break on class name and ID modifications for this element and its subtree.</p>
</break-on>

<break-on children>
	<p>Will break on adding and removing direct descendants.</p>
</break-on>

<break-on children subtree>
	<p>Will break on adding and removing all descendants.</p>
</break-on>


<break-on selector=":scope > div > p" attributes="class">
	<div>
		<p>Setting the breakpoint on a nested element</p>
	</div>
</break-on>

<break-on text>
	<p>Text changes within an element. This applies to any text change in the subtree.</p>
</break-on>
```

## Future

- Options for only additions or deletions of attributes and children.
