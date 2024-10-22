using jcdcdev.Umbraco.GroupsToTabs.Web;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Infrastructure.Manifest;

namespace jcdcdev.Umbraco.GroupsToTabs.Core;

public static class UmbracoBuilderExtensions
{
    public static void AddGroupsToTabs(this IUmbracoBuilder builder)
    {
        builder.Services.ConfigureOptions<ConfigApiSwaggerGenOptions>();
        builder.Services.AddSingleton<IPackageManifestReader, PackageManifestReader>();
    }
}
