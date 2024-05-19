/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// let's emulate old JSX namespace untill all deps are updated to support React 19
import { JSX as ReactJSX } from 'react/jsx-runtime';
declare global {
	namespace JSX {
		type ElementType = ReactJSX.ElementType;
		interface Element extends ReactJSX.Element {}
		interface ElementClass extends ReactJSX.ElementClass {}
		interface ElementAttributesProperty extends ReactJSX.ElementAttributesProperty {}
		interface ElementChildrenAttribute extends ReactJSX.ElementChildrenAttribute {}
		type LibraryManagedAttributes<C, P> = ReactJSX.LibraryManagedAttributes<C, P>;
		interface IntrinsicAttributes extends ReactJSX.IntrinsicAttributes {}
		interface IntrinsicClassAttributes<T> extends ReactJSX.IntrinsicClassAttributes<T> {}
		interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
	}
}
