using System.Reflection;
using jcdcdev.Umbraco.Core.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Api.Common.OpenApi;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Infrastructure.Manifest;
using Umbraco.Cms.Api.Management.OpenApi;

namespace jcdcdev.Umbraco.GroupsToTabs.Core;

public static class UmbracoBuilderExtensions
{
    public static void AddGroupsToTabs(this IUmbracoBuilder builder)
    {
        builder.AddBackOfficeOpenApiDocument(Constants.Api.ApiName,
            document => document
                .WithTitle(Constants.Api.Title)
                .WithBackOfficeAuthentication()
                .ConfigureOpenApiOptions(options =>
                {
                    options.AddDocumentTransformer((doc, _, _) =>
                    {
                        doc.Info.Version = Assembly.GetAssembly(typeof(UmbracoBuilderExtensions))?.GetName().Version?.ToSemVer()?.ToString() ?? "0.1.0";
                        return Task.CompletedTask;
                    });
                }));

        builder.Services.AddSingleton<IPackageManifestReader, PackageManifestReader>();
    }
}
