import {ManifestDashboard} from "@umbraco-cms/backoffice/dashboard";

export const manifests: Array<ManifestDashboard> = [
    {
        type: "dashboard",
        alias: "jcdcdev.groups-to-tabs.dashboard",
        name: "GroupsToTabs Dashboard",
        elementName: "groups-to-tabs-dashboard",
        js: () => import("./dashboard.ts"),
        weight: 200,
        meta: {
            label: "🔃 Groups to Tabs",
            pathname: "groups-to-tabs"
        },
        conditions: [
            {
                alias: "Umb.Condition.SectionAlias",
                // @ts-ignore
                match: "Umb.Section.Settings",
            }
        ]
    }
];
