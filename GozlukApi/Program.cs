using Microsoft.EntityFrameworkCore;
using GozlukApi.Data;
using GozlukApi.Models;

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

// İlk başlatmada tabloları ve seed verileri oluştur
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Products.Any())
    {
        db.Products.AddRange(
            new Product { Name = "Aviator Classic", Brand = "Ray-Ban", Model = "RB3025", Price = 1999.00m, Stock = 40, ImageUrl = "/images/aviator.jpg", Description = "İkonik pilot gözlük, altın metal çerçeve, yeşil cam", Gender = "Erkek" },
            new Product { Name = "Wayfarer", Brand = "Ray-Ban", Model = "RB2140", Price = 1499.00m, Stock = 35, ImageUrl = "/images/wayfarer.jpg", Description = "Klasik dikdörtgen çerçeve, siyah", Gender = "Unisex" },
            new Product { Name = "Clubmaster", Brand = "Ray-Ban", Model = "RB3016", Price = 1699.00m, Stock = 30, ImageUrl = "/images/clubmaster.jpg", Description = "Retro browline tasarım, kahverengi", Gender = "Erkek" },
            new Product { Name = "Justin Classic", Brand = "Ray-Ban", Model = "RB4165", Price = 1299.00m, Stock = 45, ImageUrl = "/images/justin.jpg", Description = "Sportif dikdörtgen çerçeve, mat siyah", Gender = "Erkek" },
            new Product { Name = "Round Metal", Brand = "Ray-Ban", Model = "RB3447", Price = 1599.00m, Stock = 25, ImageUrl = "/images/roundmetal.jpg", Description = "Vintage yuvarlak metal çerçeve, altın", Gender = "Unisex" },
            new Product { Name = "Hexagonal Flat", Brand = "Ray-Ban", Model = "RB3548N", Price = 1749.00m, Stock = 20, ImageUrl = "/images/hexagonal.jpg", Description = "Altıgen çerçeve, gümüş metal", Gender = "Erkek" },
            new Product { Name = "Erika", Brand = "Ray-Ban", Model = "RB4171", Price = 1399.00m, Stock = 30, ImageUrl = "/images/erika.jpg", Description = "Kadife dokulu yuvarlak çerçeve, mat siyah", Gender = "Kadın" },
            new Product { Name = "Thalia", Brand = "Ray-Ban", Model = "RB2195", Price = 1599.00m, Stock = 20, ImageUrl = "/images/thalia.jpg", Description = "Kelebek form, şeffaf kahverengi", Gender = "Kadın" },
            new Product { Name = "Aviator Reverse", Brand = "Ray-Ban", Model = "RB0101S", Price = 2299.00m, Stock = 15, ImageUrl = "/images/aviator_reverse.jpg", Description = "Ters aviator, gümüş çerçeve", Gender = "Erkek" },
            new Product { Name = "Wayfarer Oval", Brand = "Ray-Ban", Model = "RB2242", Price = 1799.00m, Stock = 18, ImageUrl = "/images/wayfarer_oval.jpg", Description = "Oval wayfarer, şeffaf çerçeve", Gender = "Unisex" },
            new Product { Name = "Panthère de Cartier", Brand = "Cartier", Model = "CT0345S", Price = 24500.00m, Stock = 8, ImageUrl = "/images/panthere.jpg", Description = "Altın kaplama metal çerçeve, lüks koleksiyon", Gender = "Kadın" },
            new Product { Name = "Santos de Cartier", Brand = "Cartier", Model = "CT0039S", Price = 22000.00m, Stock = 6, ImageUrl = "/images/santos.jpg", Description = "Dikdörtgen çerçeve, altın ve siyah", Gender = "Erkek" },
            new Product { Name = "Signature C de Cartier", Brand = "Cartier", Model = "CT0229S", Price = 19500.00m, Stock = 7, ImageUrl = "/images/signature_c.jpg", Description = "İnce metal çerçeve, gümüş", Gender = "Unisex" },
            new Product { Name = "Trinity de Cartier", Brand = "Cartier", Model = "CT0353S", Price = 21000.00m, Stock = 5, ImageUrl = "/images/trinity.jpg", Description = "Üç renk altın detaylı çerçeve", Gender = "Kadın" },
            new Product { Name = "Louis Cartier", Brand = "Cartier", Model = "CT0271S", Price = 20500.00m, Stock = 6, ImageUrl = "/images/louis_cartier.jpg", Description = "Klasik dikdörtgen, güneş sarısı cam", Gender = "Erkek" },
            new Product { Name = "TH Flex", Brand = "Tommy Hilfiger", Model = "TH1970/S", Price = 1850.00m, Stock = 30, ImageUrl = "/images/th_flex.jpg", Description = "Esnek çerçeve, lacivert", Gender = "Erkek" },
            new Product { Name = "TH Preppy", Brand = "Tommy Hilfiger", Model = "TH2089/S", Price = 1650.00m, Stock = 25, ImageUrl = "/images/th_preppy.jpg", Description = "Klasik kare form, havana", Gender = "Erkek" },
            new Product { Name = "TH Iconic", Brand = "Tommy Hilfiger", Model = "TH1980/S", Price = 1750.00m, Stock = 20, ImageUrl = "/images/th_iconic.jpg", Description = "Amerikan klasiği, kırmızı-lacivert detay", Gender = "Unisex" },
            new Product { Name = "TH Modern", Brand = "Tommy Hilfiger", Model = "TH2067/S", Price = 1550.00m, Stock = 22, ImageUrl = "/images/th_modern.jpg", Description = "Modern dikdörtgen, gümüş çerçeve", Gender = "Kadın" },
            new Product { Name = "TH Sport", Brand = "Tommy Hilfiger", Model = "TH1955/S", Price = 1450.00m, Stock = 28, ImageUrl = "/images/th_sport.jpg", Description = "Sportif wrap tasarım, siyah", Gender = "Erkek" },
            new Product { Name = "VO Hailey", Brand = "Vogue", Model = "VO5338S", Price = 899.00m, Stock = 35, ImageUrl = "/images/vo_hailey.jpg", Description = "Hailey Bieber koleksiyonu, kelebek form", Gender = "Kadın" },
            new Product { Name = "VO Pillow", Brand = "Vogue", Model = "VO5484S", Price = 799.00m, Stock = 40, ImageUrl = "/images/vo_pillow.jpg", Description = "Yastık formu, pembe şeffaf çerçeve", Gender = "Kadın" },
            new Product { Name = "VO Geometric", Brand = "Vogue", Model = "VO5352S", Price = 749.00m, Stock = 30, ImageUrl = "/images/vo_geometric.jpg", Description = "Geometrik çerçeve, havana", Gender = "Unisex" },
            new Product { Name = "VO Retro", Brand = "Vogue", Model = "VO5426S", Price = 849.00m, Stock = 25, ImageUrl = "/images/vo_retro.jpg", Description = "Retro yuvarlak çerçeve, mor", Gender = "Kadın" },
            new Product { Name = "VO Classic", Brand = "Vogue", Model = "VO5291S", Price = 699.00m, Stock = 35, ImageUrl = "/images/vo_classic.jpg", Description = "Klasik dikdörtgen, siyah", Gender = "Erkek" },
            new Product { Name = "Medusa Icon", Brand = "Versace", Model = "VE4361", Price = 5500.00m, Stock = 12, ImageUrl = "/images/medusa_icon.jpg", Description = "Medusa logolu kare çerçeve, altın", Gender = "Erkek" },
            new Product { Name = "Greca", Brand = "Versace", Model = "VE4406", Price = 5200.00m, Stock = 10, ImageUrl = "/images/greca.jpg", Description = "Greca desen, siyah asetat", Gender = "Erkek" },
            new Product { Name = "Rock Icons", Brand = "Versace", Model = "VE4371", Price = 4800.00m, Stock = 8, ImageUrl = "/images/rock_icons.jpg", Description = "Pilot form, gümüş Medusa detay", Gender = "Unisex" },
            new Product { Name = "Biggie", Brand = "Versace", Model = "VE4392", Price = 5800.00m, Stock = 7, ImageUrl = "/images/biggie.jpg", Description = "Oversize kare, altın Medusa", Gender = "Kadın" },
            new Product { Name = "VE Shield", Brand = "Versace", Model = "VE4445", Price = 6200.00m, Stock = 6, ImageUrl = "/images/ve_shield.jpg", Description = "Shield tasarım, siyah-altın", Gender = "Erkek" },
            new Product { Name = "Miu Miu Glimpse", Brand = "Miu Miu", Model = "MU 54ZS", Price = 8900.00m, Stock = 8, ImageUrl = "/images/miumiu_glimpse.jpg", Description = "Logo detaylı oval çerçeve, açık mavi", Gender = "Kadın" },
            new Product { Name = "Miu Miu Logo", Brand = "Miu Miu", Model = "MU 01ZS", Price = 9200.00m, Stock = 6, ImageUrl = "/images/miumiu_logo.jpg", Description = "Büyük logo, dikdörtgen form, siyah", Gender = "Kadın" },
            new Product { Name = "Miu Miu Runway", Brand = "Miu Miu", Model = "MU 11WS", Price = 8500.00m, Stock = 7, ImageUrl = "/images/miumiu_runway.jpg", Description = "Pist koleksiyonu, dikdörtgen, havana", Gender = "Unisex" },
            new Product { Name = "Miu Miu Core", Brand = "Miu Miu", Model = "MU 03ZS", Price = 7900.00m, Stock = 9, ImageUrl = "/images/miumiu_core.jpg", Description = "Kedi gözü form, pembe şeffaf", Gender = "Kadın" },
            new Product { Name = "Miu Miu Mantle", Brand = "Miu Miu", Model = "MU 69VS", Price = 8200.00m, Stock = 5, ImageUrl = "/images/miumiu_mantle.jpg", Description = "Geometrik oversize, krem beyaz", Gender = "Kadın" }
        );
        db.SaveChanges();
    }
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();
