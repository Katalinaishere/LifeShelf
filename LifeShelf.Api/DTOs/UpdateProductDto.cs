using System.ComponentModel.DataAnnotations;

namespace LifeShelf.Api.DTOs;

public class UpdateProductDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Category { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Subcategory { get; set; }

    public decimal? Price { get; set; }

    public decimal? Quantity { get; set; }

    [StringLength(20)]
    public string? Unit { get; set; }

    public DateTime? PurchaseDate { get; set; }

    public DateTime? OpenedDate { get; set; }

    public DateTime? ExpirationDate { get; set; }

    public int? ExpectedDurationDays { get; set; }

    [StringLength(100)]
    public string? UsageFrequency { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}