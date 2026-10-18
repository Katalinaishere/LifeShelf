using LifeShelf.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LifeShelf.Api.Data;

public class LifeShelfDbContext
    : IdentityDbContext<ApplicationUser>
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
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>()
            .HasOne(product => product.User)
            .WithMany(user => user.Products)
            .HasForeignKey(product => product.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UsageLog>()
            .HasOne(log => log.Product)
            .WithMany(product => product.UsageLogs)
            .HasForeignKey(log => log.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}