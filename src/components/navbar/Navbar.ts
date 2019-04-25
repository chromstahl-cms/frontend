import { Component, ComponentBuildFunc, ComponentProps, isDefinedAndNotEmpty } from '@kloudsoftware/eisen';
import { VNode, Attribute, cssClass, id, labelFor, password, VNodeType, src } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';

import { css } from './navbarcss';
import { RouterLink } from '@kloudsoftware/eisen';
import { HttpClient } from '@kloudsoftware/chromstahl-plugin';
import { NavbarDTO } from './navbarDTO';

export class Navbar extends Component {
    public build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props): ComponentProps => {
            let loginLink = new RouterLink(app, "/login", [], "")
            let routerLinkHome = new RouterLink(app, "/", [
                app.k("h2", { value: "{{ blogName }}", props: props })
            ], "");

            loginLink.addClass("loginIcon");

            let loginIcon: VNode = null;
            if (isDefinedAndNotEmpty(window.localStorage.getItem("token"))) {
                loginIcon = app.k("p", { value: window.localStorage.getItem("userName") })
            } else {
                loginIcon = app.k("img", { attrs: [src("login.svg")] });
            }

            loginLink.appendChild(loginIcon);

            app.createElement("style", css, root);
            const div = app.k("div", { attrs: [cssClass("logo-container")] }, [
                routerLinkHome,
                app.k("p", { value: "{{ blogSubtitle }}", props: props }),
                app.k("div", { attrs: [cssClass("navbarDivider")]})
            ]);

            app.eventPipeLine.registerEvent("login", (userName: string) => {
                const parent = loginIcon.parent;
                parent.removeChild(loginIcon);
                parent.appendChild(app.k("p", { value: userName }));
            });

            const http = app.get<HttpClient>("http");
            http.peformGet("/navbar/links").then(resp => {
                if (resp.status >= 400) {
                    throw new Error(`Request returned a status code of ${resp.status}: ${resp.statusText}`);
                }
                return resp.json();
            }).then(json => {
                const navItems = json as Array<NavbarDTO>;
                navItems.forEach(item => {
                const el = new RouterLink(app, item.path, [], item.linkText, undefined,[cssClass("navbarlink border")]);
                    div.appendChild(el);
                });
                div.appendChild(loginLink);
                root.appendChild(div);
            }).catch(err => {
                console.error(err);
                root.appendChild(div);
            });

            return {
                remount: () => {
                }
            }
        }
    }
}
