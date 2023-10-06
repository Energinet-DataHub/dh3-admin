﻿// <auto-generated/>
#nullable enable
using System;
using HotChocolate.Execution.Configuration;

namespace Microsoft.Extensions.DependencyInjection
{
    public static partial class WebApiTypesRequestExecutorBuilderExtensions
    {
        public static IRequestExecutorBuilder AddWebApiTypes(this IRequestExecutorBuilder builder)
        {
            RegisterGeneratedDataLoader(builder);

            builder.AddDataLoader<global::Energinet.DataHub.WebApi.GraphQL.ActorNameByMarketRoleDataLoader>();
            builder.AddDataLoader<global::Energinet.DataHub.WebApi.GraphQL.AuditIdentityCacheDataLoader>();
            builder.AddDataLoader<global::Energinet.DataHub.WebApi.GraphQL.GridAreaByCodeBatchDataLoader>();
            builder.AddDataLoader<global::Energinet.DataHub.WebApi.GraphQL.GridAreaByIdBatchDataLoader>();
            builder.AddDataLoader<global::Energinet.DataHub.WebApi.GraphQL.UserBatchDataLoader>();
            builder.AddDataLoader<global::Energinet.DataHub.WebApi.GraphQL.UserCacheDataLoader>();
            builder.AddType<global::Energinet.DataHub.WebApi.GraphQL.DateRangeType>();
            builder.AddType<global::Energinet.DataHub.WebApi.GraphQL.ActorStatusType>();
            builder.AddType<global::Energinet.DataHub.WebApi.GraphQL.ActorType>();
            builder.AddType<global::Energinet.DataHub.WebApi.GraphQL.BalanceResponsibleType>();
            builder.AddType<global::Energinet.DataHub.WebApi.GraphQL.CalculationType>();
            builder.AddType<global::Energinet.DataHub.WebApi.GraphQL.EicFunctionType>();
            builder.AddType<global::Energinet.DataHub.WebApi.GraphQL.EsettExchangeEventType>();
            builder.AddType<global::Energinet.DataHub.WebApi.GraphQL.ExchangeEventProcessType>();
            builder.AddType<global::Energinet.DataHub.WebApi.GraphQL.PermissionType>();
            builder.AddType<global::Energinet.DataHub.WebApi.GraphQL.ProcessStatusType>();
            return builder;
        }

        static partial void RegisterGeneratedDataLoader(IRequestExecutorBuilder builder);
    }
}
