export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  itemUrl: string;
};

export default function ShopView({
  products,
  onCreateShare,
  onSimulateClick,
  shareId,
  shortUrl,
  lastItemUrl,
}: {
  products: Product[];
  onCreateShare: (itemUrl: string) => void;
  onSimulateClick: () => void;
  shareId: string;
  shortUrl: string;
  lastItemUrl: string;
}) {
  return (
    <section className="w-full flex flex-col items-center">
      <h2 className="text-lg font-semibold text-center mb-4">상품 리스트</h2>

      <div className="shop-grid">
        {products.map((p) => (
          <article className="shop-card" key={p.id}>
            <div className="shop-image">
              <img src={p.image} alt={p.name} />
            </div>
            <div className="p-3 space-y-2">
              <div className="shop-title-row">
                <h3 className="shop-title" title={p.name}>
                  {p.name}
                </h3>
                <span className="text-xs text-neutral-700 whitespace-nowrap">
                  {p.price.toLocaleString()}원
                </span>
              </div>
              <div className="shop-url" title={p.itemUrl}>
                {p.itemUrl}
              </div>
              <div className="shop-actions">
                <button
                  onClick={() => onCreateShare(p.itemUrl)}
                  className="primary"
                >
                  공유
                </button>
                <button
                  onClick={onSimulateClick}
                  disabled={!shareId}
                  className="secondary"
                >
                  클릭
                </button>
              </div>
              {shareId && lastItemUrl === p.itemUrl && (
                <div className="shop-info">
                  공유됨:&nbsp;
                  <code className="bg-neutral-100 px-1 py-0.5 rounded">
                    {shareId}
                  </code>
                  {shortUrl && (
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 underline text-blue-600"
                    >
                      shortUrl
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
