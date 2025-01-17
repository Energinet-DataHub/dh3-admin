// Copyright 2020 Energinet DataHub A/S
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

using System.Text;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Newtonsoft.Json;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;

public sealed class SettlementReportsClient : ISettlementReportsClient
{
    private readonly HttpClient _httpClient;
    private readonly HttpClient _lightHttpClient;
    private readonly HttpClient _apiHttpClient;

    public SettlementReportsClient(HttpClient httpClient, HttpClient lightHttpClient, HttpClient apiHttpClient)
    {
        ArgumentNullException.ThrowIfNull(httpClient);
        ArgumentNullException.ThrowIfNull(lightHttpClient);
        ArgumentNullException.ThrowIfNull(apiHttpClient);

        _httpClient = httpClient;
        _lightHttpClient = lightHttpClient;
        _apiHttpClient = apiHttpClient;
    }

    public async Task RequestAsync(SettlementReportRequestDto requestDto, CancellationToken cancellationToken)
    {
        if (IsPeriodAcrossMonths(requestDto.Filter))
        {
            throw new ArgumentException("Invalid period, start date and end date should be within same month", nameof(requestDto));
        }

        using var request = requestDto.UseAPI
            ? new HttpRequestMessage(HttpMethod.Post, "settlement-reports/RequestSettlementReport")
            : new HttpRequestMessage(HttpMethod.Post, "api/RequestSettlementReport");

        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestDto),
            Encoding.UTF8,
            "application/json");

        Task<HttpResponseMessage> responseMessage;
        if (requestDto.UseAPI)
        {
            responseMessage = _apiHttpClient.SendAsync(request, cancellationToken);
        }
        else
        {
            responseMessage = requestDto.IncludeBasisData
                ? _httpClient.SendAsync(request, cancellationToken)
                : _lightHttpClient.SendAsync(request, cancellationToken);
        }

        using var response = await responseMessage;
        response.EnsureSuccessStatusCode();
    }

    public async Task<IEnumerable<RequestedSettlementReportDto>> GetAsync(CancellationToken cancellationToken)
    {
        using var requestApi = new HttpRequestMessage(HttpMethod.Get, "settlement-reports/list");
        using var request = new HttpRequestMessage(HttpMethod.Get, "api/ListSettlementReports");
        using var lightRequest = new HttpRequestMessage(HttpMethod.Get, "api/ListSettlementReports");

        using var actualResponseApi = await _apiHttpClient.SendAsync(requestApi, cancellationToken);
        using var actualResponse = await _httpClient.SendAsync(request, cancellationToken);
        using var actualLightResponse = await _lightHttpClient.SendAsync(lightRequest, cancellationToken);

        actualResponseApi.EnsureSuccessStatusCode();
        actualResponse.EnsureSuccessStatusCode();
        actualLightResponse.EnsureSuccessStatusCode();

        var actualResponseApiContent = await actualResponseApi.Content.ReadFromJsonAsync<IEnumerable<RequestedSettlementReportDto>>(cancellationToken) ?? [];
        var actualResponseContent = await actualResponse.Content.ReadFromJsonAsync<IEnumerable<RequestedSettlementReportDto>>(cancellationToken) ?? [];
        var actualLightResponseContent = await actualLightResponse.Content.ReadFromJsonAsync<IEnumerable<RequestedSettlementReportDto>>(cancellationToken) ?? [];
        var combined = actualResponseContent
            .UnionBy(actualLightResponseContent, x => x.RequestId)
            .Concat(actualResponseApiContent)
            .OrderByDescending(x => x.CreatedDateTime);

        return combined;
    }

    public async Task<Stream> DownloadAsync(SettlementReportRequestId requestId, bool fromApi, CancellationToken cancellationToken)
    {
        using var request = fromApi
            ? new HttpRequestMessage(HttpMethod.Post, "settlement-reports/download")
            : new HttpRequestMessage(HttpMethod.Post, "api/SettlementReportDownload");
        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestId),
            Encoding.UTF8,
            "application/json");

        var response = await (fromApi
        ? _apiHttpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken)
        : _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken));

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStreamAsync(cancellationToken);
    }

    public async Task CancelAsync(SettlementReportRequestId requestId, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "settlement-reports/cancel");

        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestId),
            Encoding.UTF8,
            "application/json");

        using var responseMessage = await _apiHttpClient.SendAsync(request, cancellationToken);
        responseMessage.EnsureSuccessStatusCode();
    }

    private static bool IsPeriodAcrossMonths(SettlementReportRequestFilterDto settlementReportRequestFilter)
    {
        var startDate = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(settlementReportRequestFilter.PeriodStart, "Romance Standard Time");
        var endDate = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(settlementReportRequestFilter.PeriodEnd.AddMilliseconds(-1), "Romance Standard Time");
        return startDate.Month != endDate.Month
            || startDate.Year != endDate.Year;
    }
}
