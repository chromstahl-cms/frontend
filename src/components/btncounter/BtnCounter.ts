import { Component, ComponentBuildFunc } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';
import { VNode } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { HttpClient } from "../../HttpClient";

export default class BtnCounter extends Component {
    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {

            const http = app.get<HttpClient>("http");
            http.performGet("/test/403")

            props.setProp("times", 0);
            let btn = app.createElement("button", "You have clicked me {{ times }} times!", root, undefined, props);

            app.eventHandler.registerEventListener("click", (ev, _btn) => {
                props.setProp("times", props.getProp("times") + 1);
            }, btn)

            return {
                mounted: () => {
                    console.log("Mounted");
                },

                unmounted: () => {
                    console.log("unmounted");
                },
                remount: () => {
                }
            }
        }
    }
}
