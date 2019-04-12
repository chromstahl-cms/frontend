import { Component, VNode, Props } from "@kloudsoftware/eisen";

export class ErrorComponent extends Component {
    build(app: import("@kloudsoftware/eisen").VApp): import("@kloudsoftware/eisen").ComponentBuildFunc {
        return (root: VNode, props: Props) => {
            root.appendChild(app.k("h1", {value: "An error occured:"}))
            return {};
        }
    }
}
