using LifeShelf.Api.Data;
using LifeShelf.Api.DTOs;
using LifeShelf.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeShelf.Api.Services;

public class ProductService : IProductService
{
    private readonly LifeShelfDbContext _context;

    public ProductService(LifeShelfDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductResponseDto>> GetProductsAsync()
    {
        return await _context.Products
            .Select(product => MapToResponse(product))
            .ToListAsync();
    }

    public async Task<ProductResponseDto?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return null;
        }

        return MapToResponse(product);
    }

    public async Task<ProductResponseDto> CreateProductAsync(
        CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Brand = dto.Brand,
            Category = dto.Category,
            Subcategory = dto.Subcategory,
            Price = dto.Price,
            Quantity = dto.Quantity,
            Unit = dto.Unit,
            PurchaseDate = dto.PurchaseDate,
            OpenedDate = dto.OpenedDate,
            ExpirationDate = dto.ExpirationDate,
            ExpectedDurationDays = dto.ExpectedDurationDays,
            UsageFrequency = dto.UsageFrequency,
            Notes = dto.Notes
        };

        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        return MapToResponse(product);
    }

    public async Task<ProductResponseDto?> UpdateProductAsync(
        int id,
        UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return null;
        }

        product.Name = dto.Name;
        product.Brand = dto.Brand;
        product.Category = dto.Category;
        product.Subcategory = dto.Subcategory;
        product.Price = dto.Price;
        product.Quantity = dto.Quantity;
        product.Unit = dto.Unit;
        product.PurchaseDate = dto.PurchaseDate;
        product.OpenedDate = dto.OpenedDate;
        product.ExpirationDate = dto.ExpirationDate;
        product.ExpectedDurationDays = dto.ExpectedDurationDays;
        product.UsageFrequency = dto.UsageFrequency;
        product.Notes = dto.Notes;

        await _context.SaveChangesAsync();

        return MapToResponse(product);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return false;
        }

        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return true;
    }

    private static ProductResponseDto MapToResponse(Product product)
    {
        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Brand = product.Brand,
            Category = product.Category,
            Subcategory = product.Subcategory,
            Price = product.Price,
            Quantity = product.Quantity,
            Unit = product.Unit,
            PurchaseDate = product.PurchaseDate,
            OpenedDate = product.OpenedDate,
            ExpirationDate = product.ExpirationDate,
            ExpectedDurationDays = product.ExpectedDurationDays,
            UsageFrequency = product.UsageFrequency,
            Notes = product.Notes,
            CreatedAt = product.CreatedAt
        };
    }
}