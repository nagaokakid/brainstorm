FROM mcr.microsoft.com/dotnet/aspnet:7.0-nanoserver-1809 AS base
WORKDIR /app
EXPOSE 5135

ENV ASPNETCORE_URLS=http://+:5135/

FROM mcr.microsoft.com/dotnet/sdk:7.0-nanoserver-1809 AS build
ARG configuration=Release
WORKDIR /src
COPY ["Logic/Logic.csproj", "Logic/"]
RUN dotnet restore "Logic\Logic.csproj"
COPY . .
WORKDIR "/src/Logic"
RUN dotnet build "Logic.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "Logic.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Logic.dll"]