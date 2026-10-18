
using LifeShelf.Api.Data;
using LifeShelf.Api.DTOs;
using LifeShelf.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeShelf.Api.Services;

public class UsageLogService : IUsageLogService
{
    private readonly LifeShelfDbContext _context;

    public UsageLogService(LifeShelfDbContext context)
    {
        _context = context;
    }

    public async Task<List<UsageLogResponseDto>?> GetLogsForProductAsync(
        int productId,
        string userId)
    {
        var ownsProduct = await _context.Products.AnyAsync(
            product => product.Id == productId
                && product.UserId == userId);

        if (!ownsProduct)
        {
            return null;
        }

        return await _context.UsageLogs
            .Where(log => log.ProductId == productId)
            .OrderByDescending(log => log.Date)
            .Select(log => new UsageLogResponseDto
            {
                Id = log.Id,
                ProductId = log.ProductId,
                Date = log.Date,
                AmountUsed = log.AmountUsed,
                Unit = log.Unit,
                Notes = log.Notes
            })
            .ToListAsync();
    }

    public async Task<UsageLogResponseDto?> GetLogByIdAsync(
        int id,
        string userId)
    {
        return await _context.UsageLogs
            .Where(log => log.Id == id
                && log.Product.UserId == userId)
            .Select(log => new UsageLogResponseDto
            {
                Id = log.Id,
                ProductId = log.ProductId,
                Date = log.Date,
                AmountUsed = log.AmountUsed,
                Unit = log.Unit,
                Notes = log.Notes
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UsageLogResponseDto?> CreateUsageLogAsync(
        CreateUsageLogDto dto,
        string userId)
    {
        var ownsProduct = await _context.Products.AnyAsync(
            product => product.Id == dto.ProductId
                && product.UserId == userId);

        if (!ownsProduct)
        {
            return null;
        }

        var usageLog = new UsageLog
        {
            ProductId = dto.ProductId,
            Date = dto.Date,
            AmountUsed = dto.AmountUsed,
            Unit = dto.Unit,
            Notes = dto.Notes
        };

        _context.UsageLogs.Add(usageLog);
        await _context.SaveChangesAsync();

        return new UsageLogResponseDto
        {
            Id = usageLog.Id,
            ProductId = usageLog.ProductId,
            Date = usageLog.Date,
            AmountUsed = usageLog.AmountUsed,
            Unit = usageLog.Unit,
            Notes = usageLog.Notes
        };
    }

    public async Task<bool> DeleteUsageLogAsync(
        int id,
        string userId)
    {
        var usageLog = await _context.UsageLogs
            .FirstOrDefaultAsync(log =>
                log.Id == id &&
                log.Product.UserId == userId);

        if (usageLog == null)
        {
            return false;
        }

        _context.UsageLogs.Remove(usageLog);
        await _context.SaveChangesAsync();

        return true;
    }
}
