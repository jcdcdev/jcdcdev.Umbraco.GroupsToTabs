import {UMB_AUTH_CONTEXT} from "@umbraco-cms/backoffice/auth";
import {UmbEntryPointOnInit} from "@umbraco-cms/backoffice/extension-api";
import {GroupsToTabsContext} from "./context/groups-to-tabs.context.ts";
import {manifests} from "./dashboard/manifest.ts";
import {client} from './api';

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
    extensionRegistry.registerMany([...manifests]);
    _host.consumeContext(UMB_AUTH_CONTEXT, async (_auth) => {
        if (!_auth) {
            console.error('No auth context found');
            return;
        }

        const config = _auth.getOpenApiConfiguration();
        client.setConfig({
            auth: config.token,
            baseUrl: config.base,
            credentials: config.credentials,
        });

        client.interceptors.request.use(async (request, _options) => {
            const token = await _auth.getLatestToken();
            request.headers.set('Authorization', `Bearer ${token}`);
            return request;
        });

        new GroupsToTabsContext(_host);
    });
};
