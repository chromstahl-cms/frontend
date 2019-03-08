import { VNode, Attribute } from './VNode';
import {VApp} from './VApp';
import {Comparable, arraysEquals} from './Common'

export class Renderer {
    public render(app: VApp): VNode{
        return this.renderNode(app.rootNode);
    }

    private renderNode(node: VNode): VNode {
        if(node.parent != undefined) {
            this.performDOMRender(node);
        }
        node.children.forEach(child => {
            this.performDOMRender(child);
            if(child.children.length != 0) {
                child.children.forEach(childchild => this.renderNode(childchild));
            }
        })

        return node;
    }

    private performDOMRender(node: VNode) {
        console.log("rendering: ", node);
        let $elem = this.performDOMelCreation(node);
        node.parent.htmlElement.appendChild($elem);
    }

    private performDOMelCreation(node: VNode):HTMLElement {
        let $elem = document.createElement(node.nodeName);
        node.htmlElement = $elem;
        $elem.innerHTML = node.innerHtml;
        if(node.attrs != undefined) {
            node.attrs.forEach(attr => $elem.setAttribute(attr.attrName, attr.attrValue));
        }

        return $elem;
    }

    public diff(oldVTree: VNode, newVTree?: VNode): (node: VNode) => VNode {
        if(newVTree == undefined) {
            //Assume DOM is destroyed, return undefined node
            return vNode => {
                console.log("removing: ", vNode)
                vNode.remove();
                return undefined;
            }
        }

        const attrPatches = this.diffAttrs(oldVTree.attrs, newVTree.attrs);
        const childPatches = this.diffChildren(oldVTree.children, newVTree.children);

        if(oldVTree.nodeName != newVTree.nodeName) {
            return vNode => {
                console.log("replacing: ", vNode)
                vNode.replaceWith(newVTree);
                attrPatches(vNode);
                childPatches(vNode);
                return this.renderNode(newVTree);
            }
        }

       // Shortcircuit for simple html changes
        if(oldVTree.nodeName == newVTree.nodeName && arraysEquals(oldVTree.attrs, newVTree.attrs)) {
            return vNode => {
                vNode.replaceWith(newVTree);
                attrPatches(vNode);
                childPatches(vNode);
                return vNode;
            }
        }


        return vNode => {
            attrPatches(vNode);
            childPatches(vNode);
            return vNode;
        }
    }

    private diffAttrs(oldAttrs: Attribute[], newAttrs: Attribute[]): (node: VNode) => VNode {
        //Shortcircuit for same attributes
        if(arraysEquals(oldAttrs, newAttrs)) {
            return node => node;
        }

        const patches = [];
        newAttrs.forEach(attr => {
            patches.push((node: VNode) => {
                node.htmlElement.setAttribute(attr.attrName, attr.attrValue)
                return node;
            })
        })

        oldAttrs.forEach(attr => {
            patches.push((node: VNode) => {
                node.htmlElement.removeAttribute(attr.attrName);
                return node;
            })
        })

        return node => {
            patches.forEach(patch => patch(node));
            return node;
        }
    }

    private diffChildren(oldChildren: VNode[], newChildren: VNode[]) {
        const patches = [];
        //This handles every child that is contained in oldChildren
        oldChildren.forEach((child, i) => {
            patches.push(this.diff(child, newChildren[i]))
        })

        console.log(newChildren.length - oldChildren.length);
        const additionalPatches = [];
        //This handles every child that is NOT in oldChildren
        newChildren.slice(oldChildren.length).forEach((child) => {
            (additionalPatches.push((node: VNode) => {
                console.log("new child added to dom: ", node)
                const vNode = this.renderNode(child);
                node.children.push(vNode);
                return vNode;
            }));
        })

        return (parent: VNode) => {
            parent.children.forEach((child, i) => {
                if(patches[i] != undefined) {
                    patches[i](child);
                }
            })

            additionalPatches.forEach(patch => patch(parent));
        }
    }
}
