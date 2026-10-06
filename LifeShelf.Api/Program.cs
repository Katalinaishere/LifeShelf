using LifeShelf.Api.Data;
using LifeShelf.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("LifeShelfFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

builder.Services.AddDbContext<LifeShelfDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("LifeShelfDatabase")
    ));

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IUsageLogService, UsageLogService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("LifeShelfFrontend");

app.MapControllers();

app.Run();