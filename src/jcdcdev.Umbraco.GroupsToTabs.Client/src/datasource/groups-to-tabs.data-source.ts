import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import {
    type GetStartByTypeResponse, GroupsToTabs
} from "../api";

export interface IGroupsToTabsDataSource {
    getUmbracoGroupsToTabsApiV1Start(type: string): Promise<UmbDataSourceResponse<GetStartByTypeResponse>>;
}

export class GroupsToTabsDataSource implements IGroupsToTabsDataSource {

    #host: UmbControllerHost;

    constructor(host: UmbControllerHost) {
        this.#host = host;
    }

    async getUmbracoGroupsToTabsApiV1Start(type: string): Promise<UmbDataSourceResponse<GetStartByTypeResponse>> {
        return await tryExecute(this.#host, GroupsToTabs.getStartByType({ path: { type: type } }))
    }
}
