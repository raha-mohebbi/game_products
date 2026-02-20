 Chatbots / Development Notes

## 1️⃣ Pagination در صفحه Products

**Issue:**  
هنگام رفتن به صفحه بعدی محصولات (`Next`)، صفحه می‌رفت روی لودینگ و در کنسول GET 404 می‌داد.  

**Analysis:**  
- مشکل از `React Query` نبودن `keepPreviousData: true` بود  
- یا `page` درست در `queryKey` لحاظ نشده بود  
- API RAWG نیاز به پارامتر `page` و `key` داشت  

**Solution:**  
```ts
const { data, isLoading, isFetching, error } = useQuery<ProductsResponse>({
  queryKey: ["products", search, selectedGenres, page],
  queryFn: () => fetchProducts(search, selectedGenres, page),
  keepPreviousData: true,
});

اضافه کردن keepPreviousData: true باعث شد که داده‌های صفحه قبل تا fetch صفحه جدید نگه داشته شوند و UI ناپایدار نشود.

مطمئن شدیم که page در queryKey لحاظ شده و پارامتر API صحیح ارسال شود.

2️⃣ مشکل استفاده از useParams و نوع داده

Issue:
در صفحه جزئیات محصول (ProductDetailPage)، هنگام گرفتن id از useParams()، نوع داده string بود و مستقیم Number(params.id) باعث می‌شد گاهی NaN شود و fetch با error مواجه شود.

Solution:

const params = useParams();
const id = Number(params.id);

const { data, isLoading, error } = useQuery<Product>({
  queryKey: ["product", id],
  queryFn: () => fetchProductById(id),
});

اطمینان حاصل شد که params.id همیشه قبل از استفاده Number() می‌شود.

اضافه کردن check در error boundary باعث شد پیام مناسب نمایش داده شود: Failed to load product.

3️⃣ مشکل CORS با RAWG API

Issue:
در development روی localhost هنگام fetch محصولات، ارور CORS دریافت می‌شد یا پاسخ API 403 بود.

Analysis:

مشکل از دامنه localhost بود و RAWG API فقط اجازه request با key معتبر را می‌داد.

گاهی پارامتر genres یا search اشتباه ارسال می‌شد و API 400 برمی‌گرداند.

Solution:

const res = await axios.get(API_URL, {
  params: {
    key: API_KEY,
    search: search || undefined,
    genres: genres && genres.length > 0 ? genres.join(",") : undefined,
    page,
    page_size: 12,
  },
});

اطمینان از اینکه key معتبر و پارامترهای اختیاری فقط در صورت وجود ارسال شوند.

در صورت development، استفاده از proxy یا local CORS workaround توصیه شد.

4️⃣ AdvancedSelect – مشکل انتخاب چندگانه

Issue:

هنگام انتخاب چند گزینه، UI درست آپدیت نمی‌شد و Select All/ Clear با بعضی گزینه‌ها درست کار نمی‌کرد.

همچنین، highlight text هنگام جستجو اشتباه نمایش داده می‌شد.

Solution:

استفاده از useMemo برای filteredOptions و groupedOptions

مدیریت selection با isSelected و toggleOption

Select All فقط روی filtered options اعمال شد

Highlight با تقسیم متن به parts و span با bg-yellow-200 حل شد

const highlightText = (text: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-yellow-200">{part}</span>
    ) : (part)
  );
};
5️⃣ Login – مدیریت توکن و ارور

Issue:

هنگام لاگین، بعضی اوقات error message در UI نمایش داده نمی‌شد.

همچنین loading روی Button اعمال نشده بود.

Solution:

استفاده از try/catch و err.response?.data?.message || "Login failed"

ذخیره توکن در localStorage و redirect امن به /dashboard

افزودن loading روی Button:

<Button colorScheme="teal" width="full" onClick={handleSubmit} isLoading={loading}>
  Login
</Button>
🔹 نکات کلی:

همیشه queryKey در React Query شامل تمام پارامترهای وابسته باشد (search, page, filters)

keepPreviousData: true برای Pagination ضروری است

CORS و API keys را در .env.local مدیریت کنید

AdvancedSelect نیاز به memoization و مدیریت state دقیق دارد