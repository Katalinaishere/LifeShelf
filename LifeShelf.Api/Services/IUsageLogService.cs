using LifeShelf.Api.DTOs;

namespace LifeShelf.Api.Services;

public interface IUsageLogService
{
    Task<List<UsageLogResponseDto>> GetLogsForProductAsync(int productId);

    Task<UsageLogResponseDto?> GetLogByIdAsync(int id);

    Task<UsageLogResponseDto?> CreateUsageLogAsync(CreateUsageLogDto dto);

    Task<bool> DeleteUsageLogAsync(int id);
}