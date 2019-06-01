import { Component, ComponentBuildFunc, ComponentProps, style } from '@kloudsoftware/eisen';
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
            const registerRouterLink = new RouterLink(app, "/register", [], "No account? Click here to register");
            registerRouterLink.addClass("register-link")

            let confirmBtn = app.k("span", { attrs: [cssClass("btn btn-confirm router-btn")], value: "Login" });


            userName.bindObject(userInfo, "userName");
            pwInput.bindObject(userInfo, "password");

            const errorText = app.k("p", {
                value: "Incorrect username or password. Please try again.",
                attrs: [style("display: none"), cssClass("errorText")]
            });

            // TODO: Fix centering of heading
            const div = app.k("div", { attrs: [cssClass("card form-card")] }, [
                app.k("div", { attrs: [cssClass("form-holder")] }, [
                    errorText,
                    app.k("h1", { value: "Log in", attrs: [cssClass("form-heading")] }),
                    app.k("label", { value: "Enter user name", attrs: [labelFor("iUserNam"), cssClass("user-input-label")] }),
                    userName,
                    app.k("label", { value: "Enter password", attrs: [labelFor("iPassword"), cssClass("user-input-label")] }),
                    pwInput,
                    confirmBtn,
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
                    if (undefined == json.token) {
                        errorText.setAttribute("style", "display: block");
                        return;
                    }
                    window.localStorage.setItem("token", json.token);
                    window.localStorage.setItem("userName", userInfo.userName);
                    errorText.setAttribute("style", "display: none");
                    const path = window.sessionStorage.getItem("path");
                    if (path != undefined) {
                        window.sessionStorage.removeItem("path");
                        app.router.resolveRoute(path);
                    } else {
                        app.router.resolveRoute("/setup");
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
