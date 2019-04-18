import { Component, ComponentBuildFunc, cssClass } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';
import { VNode, id } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { HttpClient } from "@kloudsoftware/chromstahl-plugin";
import { parseStrIntoVNode, parseIntoUnmanaged } from '@kloudsoftware/eisen';
import { blog1, blog2 } from "./DummyBlog";
import { css } from "./blogcss"

export class BlogViewComponent extends Component {
    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {
            root.addClass("container center-container");

            const scopedCss = app.k("style", { value: css })
            const http = app.get<HttpClient>("http");


            root.appendChild(scopedCss);
            //TODO get blogposts
            //TODO translate response into Props
            const blogMount = app.k("div", { attrs: [id("blogMount")] })
            const blogEntries = [blog1, blog2];
            const posts: Props[] = blogEntries.map(entry => {
                const map = new Map();
                map.set("heading", entry.heading);
                map.set("htmlString", entry.text);
                map.set("dateString", entry.date);
                return map;
            }).map(entry => new Props(app, entry));

            return {
                mounted: () => {
                    console.log("Mounted");
                    root.appendChild(blogMount);
                    posts.forEach(prop => {
                        app.mountComponent(new BlogPostViewComponent(), blogMount, prop);
                    });

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

export class BlogPostViewComponent extends Component {
    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {

            let containerdiv = app.k("div")
            containerdiv.addClass("card blogPostContainer");
            const dateString = new Date(props.getProp("dateString")).toLocaleDateString();
            const headDiv = app.k("div", {attrs: [cssClass("blogHeadingContainer")]}, [
                app.k("h1", { value: props.getProp("heading") }),
                app.k("p", { value: dateString })
            ]);


            containerdiv.appendChild(headDiv);
            const http = app.get<HttpClient>("http");
            const textContainer = parseIntoUnmanaged(props.getProp("htmlString"), containerdiv);
            textContainer.addClass("blogTextContainer");
            root.appendChild(containerdiv);


            return {
                mounted: () => {
                    console.log("Mounted blogpost");
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
