import {LitElement, css, html, customElement, state, property} from "@umbraco-cms/backoffice/external/lit";
import {UmbElementMixin} from "@umbraco-cms/backoffice/element-api";
import {GROUPS_TO_TABS_CONTEXT_TOKEN, GroupsToTabsContext} from "../context/groups-to-tabs.context.ts";
import {UMB_NOTIFICATION_CONTEXT, UmbNotificationContext} from "@umbraco-cms/backoffice/notification";
import {UMB_CONFIRM_MODAL, UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext} from "@umbraco-cms/backoffice/modal";

export class SelectModel {
    value: string;
    label: string;
    selected: boolean;
    description: string;

    constructor(value: string, label: string, description: string, selected: boolean) {
        this.value = value;
        this.label = label;
        this.description = description;
        this.selected = selected;
    }
}

@customElement('groups-to-tabs-dashboard')
export class GroupsToTabsDashboardElement extends UmbElementMixin(LitElement) {
    #context?: GroupsToTabsContext;
    #notificationContext?: UmbNotificationContext;
    #modalContext?: UmbModalManagerContext;
    @property()
    confirmRequired: boolean = false;
    @state()
    private _type?: SelectModel | undefined;
    @state()
    private loading: boolean = false;
    @state()
    types: SelectModel[] = [
        {
            value: "content",
            label: "Content Types",
            description: "Organise content types",
            selected: false,
        },
        {
            value: "media",
            label: "Media Types",
            description: "Organise media types",
            selected: false,
        },
        {
            value: "member",
            label: "Member Types",
            description: "Organise member types",
            selected: false,
        }
    ];

    constructor() {
        super();

        this.consumeContext(GROUPS_TO_TABS_CONTEXT_TOKEN, (context) => {
            this.#context = context;
        });

        this.consumeContext(UMB_NOTIFICATION_CONTEXT, (context) => {
            this.#notificationContext = context;
        });

        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (context) => {
            this.#modalContext = context;
        });
    }

    renderBody() {
        if (this.loading) {
            return html`
                <uui-loader></uui-loader>
            `;
        }

        const types = this.types.map(type => {
            const look = type.selected ? "primary" : "placeholder";
            return html
                `
                    <uui-button @click="${() => this.toggleType(type)}" style="--uui-button-height: 200px" look="${look}">
                        ${type.label}
                    </uui-button>
                `;
        })
        const disableButton = this.types.filter(x => x.selected).length === 0;

        return html`
            <div>
                <form id="groups-to-tabs-form" @submit=${this.onSubmit} name="groupsToTabsForm">
                    <uui-form-layout-item>
                        <uui-label slot="label" for="parent" required="">Select types</uui-label>
                        <span slot="description">
							Select the type to convert
						</span>
                        <div class="content-type-container">
                            ${types}
                        </div>
                    </uui-form-layout-item>
                    <uui-button type="submit" look="primary" label="Submit" .disabled="${disableButton}"></uui-button>
                </form>
            </div>
        `
    }

    render() {
        return html`
            <uui-box>
            <span slot="headline">
                Move groups to tabs
            </span>
                ${this.renderBody()}
            </uui-box>
        `;
    }

    static styles = [
        css`
            :host {
                display: block;
                padding: 24px;
            }

            .content-type-container uui-button {
                width: 100%;
            }

            .content-type-container {
                display: flex;
                flex-direction: row;
                gap: var(--uui-size-3);
                max-width: 900px;
                font-size: var(--uui-size-8);
            }
        `,
    ];

    async onSubmit(e: Event) {
        e.preventDefault();
        const type = this._type;
        if (!type) {
            return;
        }

        const modalContext = this.#modalContext?.open(
            this, UMB_CONFIRM_MODAL,
            {
                data: {
                    headline: `Confirm`,
                    content: `This action cannot automatically be undone. Are you sure you want to continue?`,
                    // @ts-ignore
                    color: "primary",
                    confirmLabel: "Confirm",
                }
            }
        );
        modalContext?.onSubmit()
            .then(() => {
                this.doIt(type);
            })
            .catch(() => {
                console.debug("User has rejected");
            });
    }

    private toggleType(type: SelectModel) {
        if (type.selected) {
            return;
        }

        this.types.forEach(t => {
            t.selected = t === type;
        });


        this._type = this.types.find(t => t.selected);
        this.requestUpdate();
    }

    private async doIt(type: SelectModel) {
        this.loading = true;
        const result = await this.#context?.getUmbracoGroupsToTabsApiV1Start(type.value)
        const success = result?.success;
        const message = result?.message || "An error occurred";
        console.debug(result);
        if (!success) {
            this.#notificationContext?.peek("danger", {data: {message: message, headline: "Error"}});
        } else {
            this.#notificationContext?.peek("positive", {data: {message: message, headline: "Success"}});
        }
        setTimeout(() => {
            this.loading = false;
        }, 1000);
    }
}

export default GroupsToTabsDashboardElement;

declare global {
    interface HTMLElementTagNameMap {
        'groups-to-tabs-dashboard': GroupsToTabsDashboardElement;
    }
}
