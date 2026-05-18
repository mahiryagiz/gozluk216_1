using Microsoft.EntityFrameworkCore;
using GozlukApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
     policy =>
    {
        policy
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});

// Railway MySQL bağlantısı: önce environment variable, yoksa appsettings.json
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") 
    ?? builder.Configuration.GetConnectionString("DefaultConnection")!;

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString)
);

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();