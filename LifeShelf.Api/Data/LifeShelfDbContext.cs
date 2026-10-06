using LifeShelf.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeShelf.Api.Data;

public class LifeShelfDbContext : DbContext
{
    public LifeShelfDbContext(
        DbContextOptions<LifeShelfDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }

    public DbSet<UsageLog> UsageLogs { get; set; }

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UsageLog>()
            .HasOne(log => log.Product)
            .WithMany(product => product.UsageLogs)
            .HasForeignKey(log => log.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}