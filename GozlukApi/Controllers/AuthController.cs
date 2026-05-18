using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GozlukApi.Data;
using GozlukApi.Models;

namespace GozlukApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(User user)
    {
        var existing = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);

        if (existing != null)
        {
            return BadRequest("Bu kullanıcı adı zaten alınmış.");
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Kayıt başarılı!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.Username == loginDto.Username &&
            u.PasswordHash == loginDto.PasswordHash);

        if (user == null)
        {
            return Unauthorized("Kullanıcı adı veya şifre hatalı.");
        }

        return Ok(new { message = "Giriş başarılı!", userId = user.Id });
    }
}