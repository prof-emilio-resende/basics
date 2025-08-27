export function h(
    tag: string | Function,
    props: Record<string, any> | null,
    ...children: any[]
): HTMLElement | DocumentFragment {
    // Handle Fragment
    if (tag === Fragment) {
        const fragment = document.createDocumentFragment();
        fragment.append(...children.flat().filter(Boolean));
        return fragment;
    }

    // Handle functional components
    if (typeof tag === 'function') {
        return tag(props, children);
    }

    // Handle regular HTML elements
    const element = document.createElement(tag);

    if (props) {
        for (const [key, value] of Object.entries(props)) {
            // Handle className -> class mapping
            if (key === 'className') {
                element.setAttribute('class', value);
            } else {
                // Handle event listeners (e.g., onClick -> click)
                if (key.startsWith('on') && typeof value === 'function') {
                    const eventName = key.toLowerCase().substring(2);
                    element.addEventListener(eventName, value);
                } else {
                    // Set all other attributes
                    element.setAttribute(key, value.toString());
                }
            }
        }
    }

    // Append children recursively, handling arrays and strings
    element.append(...children.flat().filter(Boolean).map(child => {
        if (typeof child === 'string') {
            return document.createTextNode(child);
        }
        return child;
    }));

    return element;
}

export function Fragment(_props: any, children: any[]): DocumentFragment {
    const fragment = document.createDocumentFragment();
    fragment.append(...children.flat().filter(Boolean));
    return fragment;
}