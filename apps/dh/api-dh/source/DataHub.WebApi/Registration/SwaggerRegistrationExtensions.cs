﻿// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System.Reflection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Energinet.DataHub.WebApi.Registration;

public static class SwaggerExtensions
{
    public static IServiceCollection AddSwagger(this IServiceCollection services) =>
        services.AddSwaggerGen(config =>
        {
            config.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "DataHub BFF",
                Version = "1.0.0",
                Description = "Backend-for-frontend for DataHub",
            });

            config.DocumentFilter<GraphQLEndpointFactoryFilter>();

            config.SchemaFilter<RequireNonNullablePropertiesSchemaFilter>();
            config.SupportNonNullableReferenceTypes();
            config.CustomSchemaIds(x => GetCustomSchemaIds(x.FullName));

            // Set the comments path for the Swagger JSON and UI.
            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
            config.IncludeXmlComments(xmlPath);

            var securitySchema = new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer", },
            };

            config.AddSecurityDefinition("Bearer", securitySchema);

            var securityRequirement = new OpenApiSecurityRequirement { { securitySchema, new[] { "Bearer" } }, };

            config.AddSecurityRequirement(securityRequirement);
        });

    // TODO: Make this better when all clients are generated by nswag
    private static string GetCustomSchemaIds(string? fullName)
    {
        var domainList = new Dictionary<string, string>
        {
            { "Wholesale", "Wholesale" },
            { "MeteringPoints", "MeteringPoint" },
            { "MarketParticipant", "MarketParticipant" },
            { "Charges", "Charge" },
        };

        if (fullName == null)
        {
            return string.Empty;
        }

        var fullNameSplit = fullName.Split(".");
        var domain = string.Empty;
        foreach (var item in domainList.Where(item => fullNameSplit.Contains(item.Key)))
        {
            domain = item.Value;
        }

        if (fullNameSplit.Last().Contains(domain))
        {
            domain = string.Empty;
        }

        var customSchema = $"{domain}{fullNameSplit.Last()}";
        return customSchema;
    }

    /// <summary>
    /// This document filter adds a custom operation for the GraphQL endpoint.
    /// This is necessary because the GraphQL endpoint is not a standard REST endpoint - and will therefore not be automatically added by Swashbuckle.
    /// </summary>
    private class GraphQLEndpointFactoryFilter : IDocumentFilter
    {
        public void Apply(OpenApiDocument openApiDocument, DocumentFilterContext context)
        {
            var request = new OpenApiRequestBody()
            {
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    {
                        "application/json", new OpenApiMediaType
                        {
                            Schema = new OpenApiSchema
                            {
                                Type = "object",
                                Properties = new Dictionary<string, OpenApiSchema>
                                {
                                    { "query", new OpenApiSchema { Type = "string" } },
                                },
                            },
                        }
                    },
                },
            };

            var response = new OpenApiResponse
            {
                Description = "Success",
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    {
                        "application/json", new OpenApiMediaType
                            {
                                Schema = new OpenApiSchema
                                {
                                    Type = "object",
                                    AdditionalPropertiesAllowed = true,
                                    Properties = new Dictionary<string, OpenApiSchema>
                                    {
                                        { "data", new OpenApiSchema() { Type = "object" } },
                                    },
                                },
                            }
                    },
                },
            };

            // define operation
            var operation = new OpenApiOperation
            {
                Summary = "GraphQL",
                Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag { Name = "GraphQL" },
                },
                RequestBody = request,
                Responses = new()
                {
                    { "200", response },
                },
            };

            // create path item
            var pathItem = new OpenApiPathItem()
            {
                Operations = new Dictionary<OperationType, OpenApiOperation>()
                {
                    { OperationType.Post, operation },
                },
            };

            openApiDocument.Paths.Add("/graphql", pathItem);
        }
    }
}
