using LifeShelf.Api.DTOs;
using LifeShelf.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LifeShelf.Api.Controllers;

[ApiController]
[Route("api/usage-logs")]
public class UsageLogsController : ControllerBase
{
    private readonly IUsageLogService _usageLogService;

    public UsageLogsController(IUsageLogService usageLogService)
    {
        _usageLogService = usageLogService;
    }

    // GET: api/usage-logs/product/1
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<List<UsageLogResponseDto>>> GetLogsForProduct(
        int productId)
    {
        var logs = await _usageLogService
            .GetLogsForProductAsync(productId);

        return Ok(logs);
    }

    // GET: api/usage-logs/1
    [HttpGet("{id}")]
    public async Task<ActionResult<UsageLogResponseDto>> GetLog(int id)
    {
        var log = await _usageLogService.GetLogByIdAsync(id);

        if (log == null)
        {
            return NotFound();
        }

        return Ok(log);
    }

    // POST: api/usage-logs
    [HttpPost]
    public async Task<ActionResult<UsageLogResponseDto>> CreateUsageLog(
        CreateUsageLogDto dto)
    {
        var createdLog = await _usageLogService
            .CreateUsageLogAsync(dto);

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
        var deleted = await _usageLogService
            .DeleteUsageLogAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}