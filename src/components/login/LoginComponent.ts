import { Component, ComponentBuildFunc, ComponentProps } from '@kloudsoftware/eisen';
import { VNode, Attribute, cssClass, id, labelFor, password, VInputNode } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';
import { css } from './logincss'
import { RouterLink } from '@kloudsoftware/eisen';
import { isDefinedAndNotEmpty } from '@kloudsoftware/eisen';
import { HttpClient } from "@kloudsoftware/chromstahl-plugin";

class UserRegisterInfo {
    userName: string;
    password: string;
    passwordConfirm: string;
}

export class Login extends Component {
    public build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props): ComponentProps => {

            root.addClass("container center-container");

            app.createElement("style", css, root);
            let userInfo = new UserRegisterInfo();
            let pwInput = app.k("input", { attrs: [id("iPassword"), password(), cssClass("user-input")] }) as VInputNode;
            let userName = app.k("input", { attrs: [id("iUserName"), cssClass("user-input")] }) as VInputNode;
            let confirmRouterLink = new RouterLink(app, "/setup", [], "");
            const registerRouterLink = new RouterLink(app, "/register", [], "No account? Click here to register");
            confirmRouterLink.addClass("router-link");
            registerRouterLink.addClass("register-link")

            let confirmBtn = app.createElement("span", "Login", confirmRouterLink, [cssClass("btn btn-confirm router-btn")]);


            userName.bindObject(userInfo, "userName");
            pwInput.bindObject(userInfo, "password");

            // TODO: Fix centering of heading
            const div = app.k("div", { attrs: [cssClass("card form-card")] }, [
                app.k("div", { attrs: [cssClass("form-holder")] }, [
                    app.k("h1", { value: "Log in", attrs: [cssClass("form-heading")] }),
                    app.k("label", { value: "Enter user name", attrs: [labelFor("iUserNam"), cssClass("user-input-label")] }),
                    userName,
                    app.k("label", { value: "Enter password", attrs: [labelFor("iPassword"), cssClass("user-input-label")] }),
                    pwInput,
                    confirmRouterLink,
                    registerRouterLink
                ])
            ]);


            userName.validate(() => {
                return isDefinedAndNotEmpty(userInfo.userName) && userInfo.userName.length > 3
            }, "error")

            pwInput.validate(() => {
                return isDefinedAndNotEmpty(userInfo.password) && /((?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*[@#$%!]).{8,400})/.test(userInfo.password);
            }, "error")

            confirmBtn.addEventlistener("click", (evt, btn) => {
                evt.preventDefault();

                if (!userName.doValidation(false) ||
                    !pwInput.doValidation(false)) {

                    return false;
                }

                const http = app.get<HttpClient>("http");
                const resp = http.performPost("/token", userInfo);

                resp.then(resp => resp.json()).then(json => {
                    window.localStorage.setItem("token", json.token);
                    window.localStorage.setItem("userName", userInfo.userName);
                    const path = window.sessionStorage.getItem("path");
                    if (path != undefined) {
                        window.sessionStorage.removeItem("path");
                        app.router.resolveRoute(path);
                    }

                    app.eventPipeLine.callEvent("login", userInfo.userName);
                });

                return true;
            });

            root.appendChild(div);

            return {
                remount: () => {
                    (pwInput.htmlElement as HTMLInputElement).value = userInfo.password != undefined ? userInfo.password : "";
                    (userName.htmlElement as HTMLInputElement).value = userInfo.userName != undefined ? userInfo.userName : "";
                }
            }
        }
    }
}
