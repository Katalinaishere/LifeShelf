
using System.Security.Claims;
using LifeShelf.Api.DTOs;
using LifeShelf.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeShelf.Api.Controllers;

[ApiController]
[Route("api/usage-logs")]
[Authorize]
public class UsageLogsController : ControllerBase
{
    private readonly IUsageLogService _usageLogService;

    public UsageLogsController(IUsageLogService usageLogService)
    {
        _usageLogService = usageLogService;
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");
    }

    // GET: api/usage-logs/product/1
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<List<UsageLogResponseDto>>>
        GetLogsForProduct(int productId)
    {
        var userId = GetCurrentUserId();

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var logs = await _usageLogService
            .GetLogsForProductAsync(productId, userId);

        if (logs == null)
        {
            return NotFound();
        }

        return Ok(logs);
    }

    // GET: api/usage-logs/1
    [HttpGet("{id}")]
    public async Task<ActionResult<UsageLogResponseDto>> GetLog(int id)
    {
        var userId = GetCurrentUserId();

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var log = await _usageLogService
            .GetLogByIdAsync(id, userId);

        if (log == null)
        {
            return NotFound();
        }

        return Ok(log);
    }

    // POST: api/usage-logs
    [HttpPost]
    public async Task<ActionResult<UsageLogResponseDto>> CreateUsageLog(
        [FromBody] CreateUsageLogDto dto)
    {
        var userId = GetCurrentUserId();

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var createdLog = await _usageLogService
            .CreateUsageLogAsync(dto, userId);

        if (createdLog == null)
        {
            return NotFound("Product not found.");
        }

        return CreatedAtAction(
            nameof(GetLog),
            new { id = createdLog.Id },
            createdLog);
    }

    // DELETE: api/usage-logs/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUsageLog(int id)
    {
        var userId = GetCurrentUserId();

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var deleted = await _usageLogService
            .DeleteUsageLogAsync(id, userId);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
