
using LifeShelf.Api.Models;

namespace LifeShelf.Api.Tests;

public class ProductTests
{
    [Fact]
    public void NewProduct_HasExpectedDefaultValues()
    {
        // Arrange
        var product = new Product();

        // Assert
        Assert.Equal(0, product.Id);
        Assert.Equal(string.Empty, product.Name);
        Assert.Equal(string.Empty, product.Brand);
        Assert.Equal(string.Empty, product.Category);
        Assert.Null(product.ExpirationDate);
        Assert.Null(product.ExpectedDurationDays);
        Assert.Empty(product.UsageLogs);
    }
}
