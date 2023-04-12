import {
    Application,
    JSX,
    DefaultTheme, 
    DeclarationReflection,
    SignatureReflection,
    Reflection,
    DefaultThemeRenderContext,
    PageEvent,
  } from "typedoc";

export class JsonformsThemeContext extends DefaultThemeRenderContext {
    // Important: If you use `this`, this function MUST be bound! Template functions are free
    // to destructure the context object to only grab what they care about.
    override memberSources = (
        props: SignatureReflection | DeclarationReflection) => (
        <aside class="tsd-sources">
            {!!props.implementationOf && (
                <p>
                    {"Implementation of "}
                    {this.typeAndParent(props.implementationOf)}
                </p>
            )}
            {!!props.inheritedFrom && (
                <p>
                    {"Inherited from "}
                    {this.typeAndParent(props.inheritedFrom)}
                </p>
            )}
            {!!props.overwrites && (
                <p>
                    {"Overrides "}
                    {this.typeAndParent(props.overwrites)}
                </p>
            )}

            {!!props.sources && (
                <ul>
                    {props.sources.map((item) =>
                        item.url ? (
                            <li>Defined in {item.fileName}:{item.line}</li>
                        ) : null
                    )}
                </ul>
            )}
        </aside>
    );
}


export class JsonformsTheme extends DefaultTheme {
    private _contextCache?: JsonformsThemeContext;
    override getRenderContext(pageEvent: PageEvent<Reflection>) :  JsonformsThemeContext {
        this._contextCache ||= new JsonformsThemeContext(
            this,
            pageEvent,
            this.application.options
        );
        return this._contextCache;
    }
}

export function load(app: Application) {
    app.renderer.defineTheme("jsonforms-theme", JsonformsTheme);
}