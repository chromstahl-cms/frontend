import { VNode, Attribute } from './VNode'
import { Renderer } from './render';
import { Props } from './Props';

export const unmanagedNode: string = "__UNMANAGED__"

export class VApp {
    rootNode: VNode;
    targetId: string;
    dirty: boolean;
    snapshots: VApp[] = [];
    renderer: Renderer;

    constructor(targetId: string, renderer: Renderer, rootNode?: VNode) {
        this.targetId = targetId;
        this.renderer = renderer;
        let $root = document.getElementById(targetId);
        let $tagName = $root.tagName.toLowerCase();
        this.dirty = false;
        if (rootNode != undefined) {
            this.rootNode = rootNode.clone(undefined);
        } else {
            this.rootNode = new VNode(this, $tagName, new Array(), "", new Props(this), [new Attribute("id", $root.id)], undefined);
            this.rootNode.htmlElement = $root;
        }
    }


    public init() {
        this.snapshots.push(this.clone());
        this.tick();
    }

    private tick() {
        setInterval(() => {
            if (!this.dirty) {
                return;
            }

            console.log("Redrawing");
            let patch = this.renderer.diffAgainstLatest(this);
            patch.apply(this.rootNode.htmlElement)
            this.dirty = false;
            this.snapshots.push(this.clone());
            console.log(this);
        }, 50);
    }

    public notifyDirty() {
        this.dirty = true;
    }

    public getLatestSnapshot(): VApp {
        if (this.snapshots.length < 1) {
            return undefined;
        }
        return this.snapshots[this.snapshots.length - 1];
    }

    public getPreviousSnapshot(): VApp {
        if (this.snapshots.length < 2) {
            return undefined;
        }
        return this.snapshots[this.snapshots.length - 2]
    }

    public clone(): VApp {
        return new VApp(this.targetId, this.renderer, this.rootNode);
    }

    public createElement(tagName: string, content = "", parentNode?: VNode, attrs?: [Attribute], props?: Props): VNode {
        this.notifyDirty();
        if (props == undefined) {
            props = new Props(this);
        }
        if (parentNode == undefined) {
            parentNode = this.rootNode;
        }

        let newNode = new VNode(this, tagName, new Array<VNode>(), content, props, attrs, parentNode);
        parentNode.children.push(newNode);

        //console.log("Adding node: ", newNode)
        return newNode;
    }

    public createUnmanagedNode(mount: VNode): HTMLElement {
        let unmanagedNode = new VNode(this, "div", [], "", new Props(this), [], mount, "__UNMANAGED__");
        mount.children.push(unmanagedNode);
        return new Renderer().renderTree(unmanagedNode);
    }
}
