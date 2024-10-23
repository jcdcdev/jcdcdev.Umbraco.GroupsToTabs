import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {tryExecuteAndNotify} from "@umbraco-cms/backoffice/resources";
import {
    getUmbracoGroupsToTabsApiV1StartByType,
    GetUmbracoGroupsToTabsApiV1StartByTypeData,
    type GetUmbracoGroupsToTabsApiV1StartByTypeResponse
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
        const data: GetUmbracoGroupsToTabsApiV1StartByTypeData =
            {
                type: type
            };

        return await tryExecuteAndNotify(this.#host, getUmbracoGroupsToTabsApiV1StartByType(data))
    }
}
