import { Component, ComponentBuildFunc, ComponentProps, id, cssClass } from '@kloudsoftware/eisen';
import { VNode } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';

//vendor
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser, NodeSpec } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup"
import { inputRules } from "prosemirror-inputrules";
import css from "./prosecss";
import OrderedMap = require('orderedmap');


export class ProsemirrorComponent extends Component {
    public build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props): ComponentProps => {
            root.addClass("container center-container");
            const editorWrapper = app.k("div", {attrs: [id("editorWrapper"), cssClass("card")]});
            root.appendChild(editorWrapper);
            let mount = app.createUnmanagedNode(editorWrapper);
            app.createElement("style", css, mount);
            //this is called when the component is mounted to the dom
            return {
                mounted: () => {
                    mount.addOnDomEventOrExecute(($mount) => {
                        console.log("prose mounting to: ", $mount);

                        const nodes : OrderedMap<NodeSpec> = schema.spec.nodes;
                        const mySchema = new Schema({
                            nodes: addListNodes(nodes, "paragraph block*", "block"),
                            marks: schema.spec.marks
                        })

                        const editor = new EditorView($mount, {
                            state: EditorState.create({
                                doc: DOMParser.fromSchema(mySchema).parse($mount),
                                plugins: exampleSetup({ schema: mySchema })
                            })
                        })

                        let btn = app.createElement("button", "getTextFromEditor", root);
                        app.eventHandler.registerEventListener("click", (_, button) => {
                            console.log(document.querySelector('.ProseMirror').innerHTML);
                        }, btn);
                    });

                }
            }
        }
    }
}
