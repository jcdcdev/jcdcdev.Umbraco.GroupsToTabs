import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {tryExecute} from "@umbraco-cms/backoffice/resources";
import {
    type GetUmbracoGroupsToTabsApiV1StartByTypeResponse, GroupsToTabsService
} from "../api";

export interface IGroupsToTabsDataSource {
    getUmbracoGroupsToTabsApiV1Start(type: string): Promise<UmbDataSourceResponse<GetUmbracoGroupsToTabsApiV1StartByTypeResponse>>;
}

export class GroupsToTabsDataSource implements IGroupsToTabsDataSource {

    #host: UmbControllerHost;

    constructor(host: UmbControllerHost) {
        this.#host = host;
    }

    async getUmbracoGroupsToTabsApiV1Start(type: string): Promise<UmbDataSourceResponse<GetUmbracoGroupsToTabsApiV1StartByTypeResponse>> {
        return await tryExecute(this.#host, GroupsToTabsService.getUmbracoGroupsToTabsApiV1StartByType({path: {type: type}}))
    }
}
