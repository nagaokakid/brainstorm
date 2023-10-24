#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["API_4350/Logic/Logic.csproj", "API_4350/Logic/"]
RUN dotnet restore "API_4350/Logic/Logic.csproj"
COPY . .
WORKDIR "/src/API_4350/Logic"
RUN dotnet build "Logic.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Logic.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Logic.dll"]
