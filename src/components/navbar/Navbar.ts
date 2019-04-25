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
            let routerlnk = new RouterLink(app, "/login", [], "")
            let routerLinkHome = new RouterLink(app, "/", [
                app.k("h2", { value: "{{ blogName }}", props: props })
            ], "");

            routerlnk.addClass("loginIcon");

            let loginIcon: VNode = null;
            if (isDefinedAndNotEmpty(window.localStorage.getItem("token"))) {
                loginIcon = app.k("p", { value: window.localStorage.getItem("userName") })
            } else {
                loginIcon = app.k("img", { attrs: [src("login.svg")] });
            }

            routerlnk.appendChild(loginIcon);

            app.createElement("style", css, root);
            const div = app.k("div", { attrs: [cssClass("logo-container")] }, [
                routerLinkHome,
                app.k("p", { value: "{{ blogSubtitle }}", props: props }),
                routerlnk
            ]);

            app.eventPipeLine.registerEvent("login", (userName: string) => {
                const parent = loginIcon.parent;
                parent.removeChild(loginIcon);
                parent.appendChild(app.k("p", { value: userName }));
            });

            const http = app.get<HttpClient>("http");
            http.peformGet("/navbar/links").then(resp => {
                const navItems = resp as Array<NavbarDTO>;
                navItems.forEach(item => {
                    const el = new RouterLink(app, item.path, [], item.linkText);
                    div.appendChild(el);
                });
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
