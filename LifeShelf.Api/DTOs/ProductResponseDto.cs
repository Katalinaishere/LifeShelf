namespace LifeShelf.Api.DTOs;

public class ProductResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Brand { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string? Subcategory { get; set; }

    public decimal? Price { get; set; }

    public decimal? Quantity { get; set; }

    public string? Unit { get; set; }

    public DateTime? PurchaseDate { get; set; }

    public DateTime? OpenedDate { get; set; }

    public DateTime? ExpirationDate { get; set; }

    public int? ExpectedDurationDays { get; set; }

    public string? UsageFrequency { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
}