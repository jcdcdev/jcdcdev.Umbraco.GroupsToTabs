import {UmbControllerBase} from "@umbraco-cms/backoffice/class-api";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {IGroupsToTabsDataSource, GroupsToTabsDataSource} from "../datasource/groups-to-tabs.data-source.ts";
import {type GetStartByTypeResponse, GroupsToTabsResponse} from "../api";

export class GroupsToTabsRepository extends UmbControllerBase {
    #resource: IGroupsToTabsDataSource;

    constructor(host: UmbControllerHost) {
        super(host);
        this.#resource = new GroupsToTabsDataSource(host);
    }

    async getUmbracoGroupsToTabsApiV1Start(dataTypeKey: string): Promise<GroupsToTabsResponse> {
        const result = await this.#resource.getUmbracoGroupsToTabsApiV1Start(dataTypeKey);
        if (result.error) {
            return {
                message: result.error.message,
                success: false
            }

        }

        const data = result.data as GetStartByTypeResponse;
        if (data.success
        ) {
            return {
                message: data.message,
                success: data.success
            }
        }

        return {
            message: "An error occurred",
            success: false
        }
    }
}
