import { VApp, VNodeBuilder} from '@kloudsoftware/eisen';
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

app.use("http", new HttpClient("http://192.168.111.118:8083", app));

const props = new Props(app);
props.setProp("blogName", "Kloud-ms");
props.setProp("blogSubtitle", "because no one wants wordpress anyway");

app.mountComponent(new Navbar(), app.rootNode, props);

const container = app.createElement("div", undefined, app.rootNode, [cssClass("container")]);

const routerMnt = app.createElement("div", undefined, container);

const router = app.useRouter(routerMnt);

router.registerRoute("/", new AdminRegister())
router.registerRoute("/foo", new BtnCounter());
router.registerRoute("/login", new Login());
router.registerRoute("/setup", new BlogInfoDialog(), props);
router.registerRoute("/prose", new ProsemirrorComponent());
router.registerRoute("/blog", new BlogViewComponent());
router.resolveRoute(document.location.pathname);
