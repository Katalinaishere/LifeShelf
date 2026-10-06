using System.ComponentModel.DataAnnotations;

namespace LifeShelf.Api.DTOs;

public class CreateUsageLogDto
{
    [Required]
    public int ProductId { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    [Range(0.01, double.MaxValue)]
    public decimal AmountUsed { get; set; }

    [Required]
    [StringLength(20)]
    public string Unit { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Notes { get; set; }
}