using LifeShelf.Api.DTOs;

namespace LifeShelf.Api.Services;

public interface IProductService
{
    Task<List<ProductResponseDto>> GetProductsAsync();

    Task<ProductResponseDto?> GetProductByIdAsync(int id);

    Task<ProductResponseDto> CreateProductAsync(
        CreateProductDto dto);

    Task<ProductResponseDto?> UpdateProductAsync(
        int id,
        UpdateProductDto dto);

    Task<bool> DeleteProductAsync(int id);
}