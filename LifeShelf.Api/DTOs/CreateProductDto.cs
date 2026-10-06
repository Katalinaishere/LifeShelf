using System.ComponentModel.DataAnnotations;

namespace LifeShelf.Api.DTOs;

public class CreateProductDto
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

    [Range(0, double.MaxValue)]
    public decimal? Price { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? Quantity { get; set; }

    [StringLength(20)]
    public string? Unit { get; set; }

    public DateTime? PurchaseDate { get; set; }

    public DateTime? OpenedDate { get; set; }

    public DateTime? ExpirationDate { get; set; }

    [Range(0, 36500)]
    public int? ExpectedDurationDays { get; set; }

    [StringLength(50)]
    public string? UsageFrequency { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}