import { VApp, VNodeBuilder, Component} from '@kloudsoftware/eisen';
import { cssClass } from '@kloudsoftware/eisen';
import { Renderer } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { AdminRegister } from './components/adminregister/AdminRegisterComponent';
import { Navbar } from './components/navbar/Navbar';
import BtnCounter from './components/btncounter/BtnCounter';
import { Login } from './components/login/LoginComponent';
import { HttpClient } from './HttpClient';
import { BlogInfoDialog } from './components/BlogInfoDialog/BlogInfoDialog';
import { ProsemirrorComponent } from './components/prosemirror/ProsemirrorComponent';
import { BlogPostViewComponent, BlogViewComponent } from './components/blogcomponent/BlogViewComponent';
import { Registration } from '@kloudsoftware/chromstahl-plugin'
import { ErrorComponent } from './components/errorView/ErrorComponent';
import { ApiResolver } from './i18n/apiResolver';

class ErrorState {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

const renderer = new Renderer();
const app = new VApp("target", renderer);
app.init();

const css = `
.container {
    display: flex;
    width: 100vw;
}

.center-container {
    align-items: center;
    flex-direction: column;
}

html, body {
    width: 100%;
    height: 100%;
}
`;
app.createElement("style", css, app.rootNode);

const httpClient = new HttpClient(`http://192.168.111.118:8083`, app);
app.use("http", httpClient);
app.useTranslationResolver(new ApiResolver(httpClient));

const props = new Props(app);
props.setProp("blogName", "Chromstahl");
props.setProp("blogSubtitle", "because no one wants wordpress anyway");

app.mountComponent(new Navbar(), app.rootNode, props);

const container = app.createElement("div", undefined, app.rootNode, [cssClass("container")]);

const routerMnt = app.createElement("div", undefined, container);

const router = app.useRouter(routerMnt);

let errorStates = new Array<ErrorState>();
let claimedRoutes = new Array<string>();
let pluginMaps: Array<Map<string, Component>> = new Array();

// $$MARK


pluginMaps.forEach(it => {
    it.forEach((value: Component, key: string) => {
        if(claimedRoutes.indexOf(key) != -1) {
            errorStates.push(new ErrorState(`Route ${key} is already registered`))
        } else if(errorStates.length == 0) {
            router.registerRoute(key, value);
        }
    });
});

if(errorStates.length != 0) {
    router.registerRoute("/error", new ErrorComponent());
    router.resolveRoute("/error");
} else {
    router.registerRoute("/", new BlogViewComponent())
    router.registerRoute("/register", new AdminRegister())
    router.registerRoute("/foo", new BtnCounter());
    router.registerRoute("/login", new Login());
    router.registerRoute("/setup", new BlogInfoDialog(), props);
    router.registerRoute("/prose", new ProsemirrorComponent());
    router.resolveRoute(document.location.pathname);
}

