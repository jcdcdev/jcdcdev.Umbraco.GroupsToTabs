import {GroupsToTabsRepository} from "../repository/groups-to-tabs.repository";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbContextToken} from "@umbraco-cms/backoffice/context-api";
import {UmbControllerBase} from "@umbraco-cms/backoffice/class-api";
import {GroupsToTabsResponse} from "../api";

export const GROUPS_TO_TABS_CONTEXT_TOKEN =
    new UmbContextToken<GroupsToTabsContext>("GroupsToTabsContext");

export class GroupsToTabsContext extends UmbControllerBase {
    #repository: GroupsToTabsRepository;

    constructor(host: UmbControllerHost) {
        super(host);
        this.provideContext(GROUPS_TO_TABS_CONTEXT_TOKEN, this);
        this.#repository = new GroupsToTabsRepository(this);
    }

    async getUmbracoGroupsToTabsApiV1Start(dataTypeKey: string): Promise<GroupsToTabsResponse> {
        return await this.#repository.getUmbracoGroupsToTabsApiV1Start(dataTypeKey);
    }
}
