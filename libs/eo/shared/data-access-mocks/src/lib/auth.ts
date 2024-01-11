/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { http, HttpResponse } from 'msw';

export function authMocks(apiBase: string) {
  return [getAuthToken(apiBase)];
}

function getAuthToken(apiBase: string) {
  return http.get(`${apiBase}/auth/token`, () => {
    const data =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGV0ZXIgUHJvZHVjZW50Iiwic3ViIjoiNjRjZjljMGYtYzYzNC00MWMwLTljYmEtNDM5NDAyNGI5MTVmIiwic2NvcGUiOiJkYXNoYm9hcmQgcHJvZHVjdGlvbiBtZXRlcnMgY2VydGlmaWNhdGVzIiwiZWF0IjoiUXZ2dmpPWTc4RmdKSHFzOENoWkYrdXJNZ0IvcitYcUJicWszMmsyMjFLMWJSUUhLTkh0dTRQQnc3V0pFVnV1dENwWnNTWmRKQURwOHFleVE4b1djdWpzelBsQjJucm1DVFdOYTVoUU1ZZVRJNlk3U0ljcCtqa2hNMEtTcWdoMXdyS3RPb0FpSmpMLzZrTzdrMVB3OUNkMkZEZWlGcHhBZ3YrSXcxMVM5QjBMdmdOQloyb0p5QnZVOTVuK3RFZFdqdGNPK3dNWWRIUmxCVW1XekZCaXhmRTczQWZDalVLMC9FcVJBbmM5aktBbFZsanVSTkhHSUQ1aUg2c0ZIZWpZdnlaNzAzWWNuMUJhMTdydHFtSHR4NEYwTWZHOFBDZXJ3eUFLQUhxbUxUcFl4bGdRRW1zYThaY2hSREMxZWNqRFNob1JBQkNFRFBGd0dXc0lmclVMK3RONDgxcGtlN1dERzk4S3JGaVVOTDRqcnZHSCtFTVdwd2VxNDZ6YnhwMGFsSFVwMTByRGZrWC9ScC9XVXpQaUdEVmlHdTNyc0t4QTFFelk0eFVnaWdmMjZGbERNOUtjOUk3M0FUbVJ6OUsvS3BadnhmRGhoOGs2N0x0Z0VjaFdBcGtlb2d4eE1kVTB0eDBEeEdNR0pzTVRQN2REamtzL0ZYbUlCcmI4Rm9aU0U5WERlbGJ0VUpxa1JBOUQ5N2lVK2JCMmwzZlZzUkc4ZFRjSlZzRGw0V0UxY2pLdDNqSFlWRy95bWUyK08wbVNNdmdkQUhvRnh3ZlFMSElobE0yaWpWRGw5b3cxMFphNmFvYURaRFpyQmgzSjZ2amZkRi9QTWUyeW1WbFhDSkg0djJ1M2dMdUV6STJtUHQyNS9XcStsV0hKbkFxek92TGpGaEhxVkNhbG1DZFFVQnkwanUyL3BsSVR2U3FGKzRjdzhWVVdXZkIzeXVIMlNMcExSRlBnQkJYc0pKU2VSeWdWYW9CUmIzejNZMnNYcHpCL3NUMFFhN3FvaEkyTWNLc1ZSOElZRm5KSFEzbEFPcGJRVGJ1NkllZmhTL3Mzc25VdkpRa1dickRzL09nQlF6dHNYY0J6NG5JQmwrMmtINExqY1gvRk1nWkNlY0ZTMWtpOXEveHRad2w3Sk01L2dPUERMUmJkZ1BFMllUSXNRV3hKRVdyQ1ZEMW4wTmpUZ0tMdkU5UVR1SnRzTTVVWFBtK2FzT1ZBTGNFTURlbG45WkJyUlNBb1VrRmxkWDF3PSIsImVpdCI6ImhyWUY3Q01XTTBEZUF6N21VdVZCRWwrcDJ5TnA5SUlvQWkwK0dUZDUwUVdqNERINGdVS3ZnSnBtYlR5allHa0ZQcXVyZlFPM3BodEVEeEhqbDFmOVZSVHhmSUpuK1p0ZnhIenlwRHlBVVBPdGxHNklEZmR4MlJLa3ErWUIyanFmc0NETnV5YnNHb0JNdS9nUm8za3FOUWlzSENPa3EzNjhJd0JKOXNlZzA5SFJyN0hTMVc3WWZubWZwT0dRRytmTGxNOFJxRFNTQVFBRHFTTzViNktsbVorMlhlbzNoWEthbXErV0tSTjdnckhzZE5SbzJOVEtLbVFDNjdOdXVKSjFFbTVyMmh2Sk9nUmROenliQ1FJVWRPZHEwWFpIcGFwalFWTFBoWFl3RGRjWHltUUg5L0dEcWNWKzdGVzZRcFl4K0x3OHp0OXR4U21KZkFpaHNaRmN6MHNpeUVOQ1poemowNzNPRkh6dnlEQzVmYStjMkVXWWJnVEtuYmV6VlRBUUFBem5obi94QmsxNTFQcnZtUTdFYkRyejY2RGdWUEc1L0pBQ2lNTkZWMXdQcHBkRkZOcEpqZlh6MDV2Q3ZDd3k0eWswUHRqcWRYQjY0UW1Nc3hrKzRMczFCelJMS0o5TkJFcENBQVdERnZIeDBqV3RKak55TFN0WWFabFNIZnIyaDRlbU5DRGFTRzVQOHk0WXFnMUZFSXo2TWdZNlMxNEpaUFhuVG5TTWFHQjJldmdGZ2hPK1V5bmY5RkhJYUQ2R0dLM3lydUl0V0JsbGhaczBSZ1p4T0tJc1hDTURzOXduQUlVME9KT1NEVktuQjlNUWRhczkwemxjanBJVFpBeFNMaHFtN0U5TENodnlmaUZLc1M2a3lDaDdCTUk4a2FVRnFRdkthZ0FhZC9TWElvMHVrc2hORCtzY3p0dEZVdkloK2hDT0JhakwyckErTWdWV0t2Zit3cnhQVXdSWVJ1dUVZYi9jYk10ZnBPakxsZFloTmpZV0I4NVoyVUdkdkE2QzFKMFNibmpxcVpVTUcwSTd6ZC8zeDZMUUxLRmlRSlhBUVAzQlR0bCtRRFFudU52cmV3MksyTDFBU0V5UXZWdTBQMFFmMmtGR2k0TDNyZHVwQm9NNG1CMzVsNXRqcHl6bm85bEgzREhyRnI4S2tJUW1zQ3JNWDl1WHBTN0xDcjlCdExKOVJXS3dKdXVGZmtXTkQrUVNZMUxNWGpKQXBFd2ZRRjlHeWFKZThuREs1ZndoL29pTFVJc09FVy8zK2RZYyIsIm1ycyI6IiIsInBrZSI6Iml6VWdQQ05hSVZrYm1iMEJweUV1NkE2TkJ6ZXp6RThYQ0lYS21nT245THZ2Q0xhZVdJb0srWG5RKzF1Z3UydjVmTFUrT0NLeUVDaDdOUGFIcEVKQi9BPT0iLCJwdHkiOiJOZW1JZFByb2Zlc3Npb25hbCIsImFjbCI6ZmFsc2UsInN1YmplY3QiOiI2NGNmOWMwZi1jNjM0LTQxYzAtOWNiYS00Mzk0MDI0YjkxNWYiLCJhdHIiOiIzNWE0OGUzNi0xZmJlLTQxMDQtYjMzMi02MDZhMjhhNzBjMjEiLCJhY3RvciI6IjM1YTQ4ZTM2LTFmYmUtNDEwNC1iMzMyLTYwNmEyOGE3MGMyMSIsInJvbGVzIjpbXSwiY29pIjoiNjRjZjljMGYtYzYzNC00MWMwLTljYmEtNDM5NDAyNGI5MTVmIiwidGluIjoiMTEyMjMzNDQiLCJjcG4iOiJQcm9kdWNlbnQgQS9TIiwibmJmIjoxNjk4MzEyMDQ5LCJleHAiOjk5OTk5OTk5OTksImlhdCI6MTY5ODMxMjA0OSwiaXNzIjoiZGVtby5lbmVyZ2lvcHJpbmRlbHNlLmRrIiwiYXVkIjoiVXNlcnMifQ.aLCTYQ-GCqjzpF7CONTFITHb5lx7ehXJ8JpWxfvTQOoqw0E5KDrNOp1TirJOYxplRI0mRQH0HrI07VtJnZVcgu22ifMJecWIMoM-CCA3mqSCWKNyN-hy5jsB_tcfaaCUeAOlOh4u7z6Vn2RzkFvdkZ9XhPBlf1zgI8hqWDP5Ja-GQJ2FCKDnQLtYUxviU83Rrx7pVnjaCqrHPTaMUa3YVvTTEbrjIQpe08cPy8JOyfdtgKbXnS1HtzWiduDmj9r4s99hvdwZwGiZXcYDqOjZS5KpGbrGkkVy6EUXml-YnbBguTsVQxcZAhRvkxhiwQLvoA1a62L1dgr7jc5dl1so9A';

    return HttpResponse.json(data, { status: 200 });
  });
}
