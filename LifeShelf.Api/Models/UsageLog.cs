namespace LifeShelf.Api.Models;

public class UsageLog
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    public decimal AmountUsed { get; set; }

    public string Unit { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public Product Product { get; set; } = null!;
}