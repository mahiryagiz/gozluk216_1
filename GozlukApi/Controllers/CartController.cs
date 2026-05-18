using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GozlukApi.Data;
using GozlukApi.Models;

namespace GozlukApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCart(int userId)
    {
        var items = await _context.Carts
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .Select(c => new
            {
                c.Id,
                c.UserId,
                c.ProductId,
                c.Quantity,
                Product = new
                {
                    c.Product.Id,
                    c.Product.Name,
                    c.Product.Brand,
                    c.Product.Model,
                    c.Product.Price,
                    c.Product.ImageUrl
                }
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] Cart cart)
    {
        var existing = await _context.Carts.FirstOrDefaultAsync(c =>
            c.UserId == cart.UserId &&
            c.ProductId == cart.ProductId);

        if (existing != null)
        {
            existing.Quantity += cart.Quantity;
        }
        else
        {
            _context.Carts.Add(cart);
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Sepete eklendi!" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuantity(int id, [FromBody] Cart cart)
    {
        var item = await _context.Carts.FindAsync(id);

        if (item == null)
        {
            return NotFound();
        }

        item.Quantity = cart.Quantity;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Miktar güncellendi!" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromCart(int id)
    {
        var item = await _context.Carts.FindAsync(id);

        if (item == null)
        {
            return NotFound();
        }

        _context.Carts.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Sepetten çıkarıldı!" });
    }
}