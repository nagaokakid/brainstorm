/*
 * Program.cs
 * ----------
 * This file contains the main method for the Logic project.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr and Mr. Akira Cooper
 * Last modified: 28.10.2021
 * Version: 1.0
*/

using Database.CollectionContracts;
using Database.Collections;
using Logic.Hubs;
using Logic.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Bson.Serialization;
using System.Text;

namespace Logic
{
    /// <summary>
    ///   This class contains the main method for the Logic project.
    /// </summary>
    public class Program
    {
        /// <summary>
        ///  This method is the main method for the Logic project.
        /// </summary>
        /// <param name="args"></param>
        public static void Main(string[] args)
        {
            var allowAllCors = "allow";

            var builder = WebApplication.CreateBuilder(args);
            // allow all cors
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: allowAllCors, policy =>
                {
                    policy.AllowCredentials().AllowAnyHeader().AllowAnyMethod().SetIsOriginAllowed(x => true);
                });
            });

            // allow data models in C# to be serializable for MongoDB BSON documents
            var objectSerializer = new ObjectSerializer(type => ObjectSerializer.DefaultAllowedTypes(type) || type.FullName.StartsWith("Database.Data"));
            BsonSerializer.RegisterSerializer(objectSerializer);

            // Add services to the container.
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddSingleton<IOnlineUserService, OnlineUserService>();
            builder.Services.AddScoped<DirectMessageService>();
            builder.Services.AddScoped<IChatRoomService, ChatRoomService>();
            builder.Services.AddSingleton<IUserCollection, UserCollection>();
            builder.Services.AddSingleton<IDirectMessageCollection, DirectMessageCollection>();
            builder.Services.AddSingleton<IChatRoomCollection, ChatRoomCollection>();
            builder.Services.AddSingleton<IBrainstormResultCollection, BrainstormResultCollection>();
            builder.Services.AddSingleton<IBrainstormService, BrainstormService>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            // the following code for jwt in swagger comes from the following stackoverflow link
            // https://stackoverflow.com/questions/43447688/setting-up-swagger-asp-net-core-using-the-authorization-headers-bearer
            builder.Services.AddSwaggerGen(setup =>
            {
                // Include 'SecurityScheme' to use JWT Authentication
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    BearerFormat = "JWT",
                    Name = "JWT Authentication",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Description = "Enter bearer token",

                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };

                setup.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

                setup.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });

            });



            // setup project for authentication
            builder.Services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JwtSettings:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]))
                };
            });

            builder.Services.AddAuthorization(x =>
            {
                x.FallbackPolicy = new AuthorizationPolicyBuilder()
                .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser()
                .Build();
            });

            builder.Services.AddSignalR();

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();
            app.UseCors(allowAllCors);
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapHub<ChatRoomHub>("/chatroom").AllowAnonymous();
            app.MapHub<DirectMessagingHub>("/direct").AllowAnonymous();

            app.Run();
        }
    }
}