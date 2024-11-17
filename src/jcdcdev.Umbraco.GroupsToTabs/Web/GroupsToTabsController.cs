using jcdcdev.Umbraco.GroupsToTabs.Core;
using jcdcdev.Umbraco.GroupsToTabs.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NPoco;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Api.Management.Filters;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseModelDefinitions;
using Umbraco.Cms.Infrastructure.Persistence.Dtos;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Extensions;

namespace jcdcdev.Umbraco.GroupsToTabs.Web;

[ApiExplorerSettings(GroupName = "Groups to Tabs")]
[GroupsToTabsRoute("")]
[MapToApi(Constants.Api.ApiName)]
[JsonOptionsName(global::Umbraco.Cms.Core.Constants.JsonOptionsNames.BackOffice)]
[ApiController]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
[AppendEventMessages]
[Produces("application/json")]
public class GroupsToTabsController(
    ILogger<GroupsToTabsController> logger,
    IContentTypeService contentTypeService,
    IMediaTypeService mediaTypeService,
    IMemberTypeService memberTypeService) : ControllerBase
{
    [HttpGet("start/{type}")]
    [Produces<GroupsToTabsResponse>]
    public async Task<IActionResult> Start(string type)
    {
        List<IContentTypeBase> contentTypes;
        switch (type)
        {
            case "content":
                contentTypes = contentTypeService.GetAll().ToList<IContentTypeBase>();
                break;
            case "media":
                contentTypes = mediaTypeService.GetAll().ToList<IContentTypeBase>();
                break;
            case "member":
                contentTypes = memberTypeService.GetAll().ToList<IContentTypeBase>();
                break;
            default:
                logger.LogError("Invalid type requested: {type}", type);
                return BadRequest(new GroupsToTabsResponse
                {
                    Success = false,
                    Message = "Invalid type"
                });
        }

        if (contentTypes.Count == 0)
        {
            logger.LogWarning("No types found for {type}", type);
            return Ok(new GroupsToTabsResponse
            {
                Success = false,
                Message = "No types found"
            });
        }

        var count = 0;
        foreach (var contentType in contentTypes)
        {
            var migratedGroups = MoveGroupsToTabs(contentType);
            if (migratedGroups == 0)
            {
                continue;
            }

            count += migratedGroups;
            switch (contentType)
            {
                case IContentType content:
                    await contentTypeService.UpdateAsync(content, global::Umbraco.Cms.Core.Constants.Security.SuperUserKey);
                    break;
                case IMediaType media:
                    await mediaTypeService.UpdateAsync(media, global::Umbraco.Cms.Core.Constants.Security.SuperUserKey);
                    break;
                case IMemberType member:
                    await memberTypeService.UpdateAsync(member, global::Umbraco.Cms.Core.Constants.Security.SuperUserKey);
                    break;
            }
        }

        var response = new GroupsToTabsResponse
        {
            Success = true,
            Message = $"Moved {count} Property Groups across {contentTypes.Count} types"
        };
        return Ok(response);
    }

    private int MoveGroupsToTabs(IContentTypeBase contentType)
    {
        var updated = 0;

        foreach (var propertyGroup in contentType.PropertyGroups)
        {
            if (propertyGroup.Type == PropertyGroupType.Tab)
            {
                continue;
            }

            propertyGroup.Type = PropertyGroupType.Tab;
            updated++;
        }

        return updated;
    }
}
