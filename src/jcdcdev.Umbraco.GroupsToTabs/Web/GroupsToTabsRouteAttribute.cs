using Umbraco.Cms.Web.Common.Routing;

namespace jcdcdev.Umbraco.GroupsToTabs.Web;

public class GroupsToTabsRouteAttribute(string template) : BackOfficeRouteAttribute($"GroupsToTabs/api/v{{version:apiVersion}}/{template.TrimStart('/')}");
