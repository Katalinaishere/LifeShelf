
using LifeShelf.Api.DTOs;

namespace LifeShelf.Api.Services;

public interface IProductService
{
    Task<List<ProductResponseDto>> GetProductsAsync(string userId);

    Task<ProductResponseDto?> GetProductByIdAsync(
        int id,
        string userId);

    Task<ProductResponseDto> CreateProductAsync(
        CreateProductDto dto,
        string userId);

    Task<ProductResponseDto?> UpdateProductAsync(
        int id,
        UpdateProductDto dto,
        string userId);

    Task<bool> DeleteProductAsync(
        int id,
        string userId);
}
