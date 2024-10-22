using jcdcdev.Umbraco.GroupsToTabs.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace jcdcdev.Umbraco.GroupsToTabs.Web;

public class ConfigApiSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
{
    public void Configure(SwaggerGenOptions options)
    {
        options.SwaggerDoc(Constants.Api.ApiName,
            new OpenApiInfo
            {
                Title = "Groups to Tabs Api",
                Version = "Latest",
                Description = "API for Groups to Tabs"
            });
    }
}
