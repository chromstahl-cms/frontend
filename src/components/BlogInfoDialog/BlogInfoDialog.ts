import { Component, ComponentBuildFunc, ComponentProps } from '@kloudsoftware/eisen';
import { VNode, Attribute, cssClass, id, labelFor, password, VNodeType, src, VInputNode } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';
import { isDefinedAndNotEmpty } from '@kloudsoftware/eisen';
import { RouterLink } from '@kloudsoftware/eisen';
import { HttpClient } from "../../HttpClient";

import { css } from "./bloginfodialogcss";

class BlogInfo {
    blogName: string
    blogSubtitle: string
}

export class BlogInfoDialog extends Component {
    public build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props): ComponentProps => {
            root.addClass("container center-container");
            app.createElement("style", css, root);
            const blogNameInput = app.k("input", { attrs: [id("iBlogName"), cssClass("user-input")] }) as VInputNode;
            const blogSubTitleInput = app.k("input", { attrs: [id("iBlogSubtitle"), cssClass("user-input")] }) as VInputNode;

            let routerlnk = new RouterLink(app, "/foo", [], "")
            routerlnk.addClass("router-link");

            let confirmBtn = app.createElement("span", "Save", routerlnk, [cssClass("btn btn-confirm router-btn")]);

            let info = new BlogInfo();
            blogNameInput.bind(props, "blogName");
            blogSubTitleInput.bind(props, "blogSubtitle");

            blogNameInput.bindObject(info, "blogName");
            blogSubTitleInput.bindObject(info, "blogSubtitle");

            blogNameInput.validate(_ => {
                return isDefinedAndNotEmpty(info.blogName);
            }, "error");
            blogSubTitleInput.validate(_ => {
                return isDefinedAndNotEmpty(info.blogSubtitle);
            }, "error");

            confirmBtn.addEventlistener("click", (evt, btn) => {
                const failed = [blogNameInput, blogSubTitleInput]
                    .map(i => i.doValidation(false))
                    .some(b => b == false);

                if (failed) {
                    return;
                }

                const http = app.get<HttpClient>("http");

                http.performPost("/blogInfo", info)
                    .then(resp => resp.json())
                    .then(json => console.log(json));
            });

            const div = app.k("div", { attrs: [cssClass("card form-card")]}, [
                app.k("h1", { value: "Give your blog a name", attrs: [cssClass("admin-register-heading")] }),
                app.k("div", { attrs: [cssClass("form-holder")] }, [
                    app.k("label", { value: "Enter the name of your blog", attrs: [labelFor("iBlogName"), cssClass("user-input-label")] }),
                    blogNameInput,
                    app.k("label", { value: "Enter a subtitle", attrs: [labelFor("iBlogSubtitle"), cssClass("user-input-label")] }),
                    blogSubTitleInput,
                    routerlnk,
                ])
            ]);

            root.appendChild(div);

            return {};
        }
    }
}
