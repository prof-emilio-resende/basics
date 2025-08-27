// Minimal JSX typings for our custom JSX runtime
// This removes the warning: "JSX element implicitly has type 'any' because no interface JSX.IntrinsicElements exists"

declare namespace JSX {
  // Our h() returns DOM nodes (elements or fragments)
  interface Element extends Node {}

  // Allow children via the `children` prop in JSX
  interface ElementChildrenAttribute {
    children: {};
  }

  // Accept any intrinsic HTML/SVG element names with loose typing.
  // You can refine this later with specific attributes if desired.
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
