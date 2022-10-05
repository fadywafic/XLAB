using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using XLAB_TASK.Models;

string text = " ";
var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddControllers();

//connecting to DB
builder.Services.AddDbContext<SalesDbContext>(
    db => db.UseSqlServer( builder.Configuration.GetConnectionString("myCon") ) 
);

//CORS
builder.Services.AddCors(options =>
options.AddPolicy(text,
builder =>
{
    builder.WithOrigins("*");
    builder.AllowAnyHeader();
    builder.AllowAnyMethod();
})
);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(text);

app.UseAuthorization();

app.MapControllers();

app.Run();
