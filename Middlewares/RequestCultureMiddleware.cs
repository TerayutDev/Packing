using Microsoft.AspNetCore.Localization;
using System.Globalization;

namespace Packing.Middlewares
{
    public class RequestCultureMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestCultureMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var currentLanguage = context.Request.Cookies[CookieRequestCultureProvider.DefaultCookieName];
            var browserLanguage = context.Request.Headers["Accept-Language"].ToString()[..2];

            if (string.IsNullOrEmpty(currentLanguage))
            {
                var culture = string.Empty;

                switch (browserLanguage)
                {
                    case "th":
                        culture = "th-TH";
                        break;
                    case "en":
                        culture = "en-US";
                        break;

                    default:
                        culture = "th-TH";
                        break;
                }

                var requestCulture = new RequestCulture(culture, culture);
                context.Features.Set<IRequestCultureFeature>(new RequestCultureFeature(requestCulture, null));

                CultureInfo.CurrentCulture = new CultureInfo(culture);
                CultureInfo.CurrentUICulture = new CultureInfo(culture);
            }

            await _next(context);
        }
    }
}
