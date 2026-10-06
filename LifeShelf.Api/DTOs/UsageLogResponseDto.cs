namespace LifeShelf.Api.DTOs;

public class UsageLogResponseDto
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public DateTime Date { get; set; }

    public decimal AmountUsed { get; set; }

    public string Unit { get; set; } = string.Empty;

    public string? Notes { get; set; }
}