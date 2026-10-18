
using LifeShelf.Api.DTOs;

namespace LifeShelf.Api.Services;

public interface IUsageLogService
{
    Task<List<UsageLogResponseDto>?> GetLogsForProductAsync(
        int productId,
        string userId);

    Task<UsageLogResponseDto?> GetLogByIdAsync(
        int id,
        string userId);

    Task<UsageLogResponseDto?> CreateUsageLogAsync(
        CreateUsageLogDto dto,
        string userId);

    Task<bool> DeleteUsageLogAsync(
        int id,
        string userId);
}
