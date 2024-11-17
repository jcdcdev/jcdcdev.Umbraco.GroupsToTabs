import {UMB_AUTH_CONTEXT} from "@umbraco-cms/backoffice/auth";
import {OpenAPI} from "./api";
import {UmbEntryPointOnInit} from "@umbraco-cms/backoffice/extension-api";
import {GroupsToTabsContext} from "./context/groups-to-tabs.context.ts";
import {manifests} from "./dashboard/manifest.ts";

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
    extensionRegistry.registerMany([...manifests]);
    _host.consumeContext(UMB_AUTH_CONTEXT, (_auth) => {
        const umbOpenApi = _auth.getOpenApiConfiguration();
        OpenAPI.TOKEN = umbOpenApi.token;
        OpenAPI.BASE = umbOpenApi.base;
        OpenAPI.WITH_CREDENTIALS = umbOpenApi.withCredentials;
        new GroupsToTabsContext(_host);
    });
};
