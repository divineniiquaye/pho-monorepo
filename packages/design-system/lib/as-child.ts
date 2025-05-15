import React, { JSX } from "react";

export function renderChildren(children: React.ReactElement) {
    const childrenType = children.type as any;
    // The children is a component
    if (typeof childrenType === "function") return childrenType(children.props);
    // The children is a component with `forwardRef`
    else if ("render" in childrenType) return childrenType.render(children.props);
    // It's a string, boolean, etc.
    else return children;
}

export function SlottableWithNestedChildren(
    { asChild, children }: { asChild?: boolean; children?: React.ReactNode },
    render: (child: React.ReactNode) => JSX.Element,
) {
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(
            renderChildren(children),
            { ref: (children as any).ref },
            // @ts-expect-error - We know that children is a valid element
            render(children.props.children),
        );
    }

    return render(children);
}
